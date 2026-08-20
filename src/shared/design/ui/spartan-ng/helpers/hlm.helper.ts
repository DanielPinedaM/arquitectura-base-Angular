import { isPlatformBrowser } from '@angular/common';
import {
	DestroyRef,
	effect,
	ElementRef,
	HostAttributeToken,
	inject,
	Injector,
	PLATFORM_ID,
	runInInjectionContext,
} from '@angular/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function hlm(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Mapa global para rastrear los class managers por elemento */
const elementClassManagers = new WeakMap<HTMLElement, ElementClassManager>();
/** Mutation observer global para todos los elementos */
let globalObserver: MutationObserver | null = null;
const observedElements = new Set<HTMLElement>();

interface ElementClassManager {
	element: HTMLElement;
	sources: Map<number, { classes: Set<string>; order: number }>;
	baseClasses: Set<string>;
	isUpdating: boolean;
	nextOrder: number;
	hasInitialized: boolean;
	restoreRafId: number | null;
	/** Las transiciones se suprimen hasta que el primer effect escribe las clases correctas */
	transitionsSuppressed: boolean;
	/** Valor original de la transición inline a restaurar después de la supresión (string vacío = no había ninguna) */
	previousTransition: string;
	/** Prioridad original de la transición inline para preservar !important al restaurar */
	previousTransitionPriority: string;
}

let sourceCounter = 0;

/**
 * Esta función agrega y quita clases dinámicamente para un elemento dado sin requerir
 * un class binding (p. ej. `[class]="..."`) que podría interferir con otros class bindings.
 *
 * 1. Esto fusionará las clases existentes en el elemento con las nuevas clases.
 * 2. También eliminará cualquier clase que haya sido agregada previamente por esta función pero que ya no esté presente en las nuevas clases.
 * 3. Múltiples llamadas a esta función en el mismo elemento se fusionarán de manera eficiente.
 */
export function classes(computed: () => ClassValue[] | string, options: ClassesOptions = {}) {
	runInInjectionContext(options.injector ?? inject(Injector), () => {
		const elementRef = options.elementRef ?? inject(ElementRef);
		const platformId = inject(PLATFORM_ID);
		const destroyRef = inject(DestroyRef);
		const baseClasses = inject(new HostAttributeToken('class'), { optional: true });

		const element = elementRef.nativeElement;

		/** Crear un identificador único para este source */
		const sourceId = sourceCounter++;

		/** Obtener o crear el class manager para este elemento */
		let manager = elementClassManagers.get(element);

		if (!manager) {
			/** Inicializar las clases base a partir de la variación (atributo host 'class') */
			const initialBaseClasses = new Set<string>();

			if (baseClasses) {
				toClassList(baseClasses).forEach((cls) => initialBaseClasses.add(cls));
			}

			manager = {
				element,
				sources: new Map(),
				baseClasses: initialBaseClasses,
				isUpdating: false,
				nextOrder: 0,
				hasInitialized: false,
				restoreRafId: null,
				transitionsSuppressed: false,
				previousTransition: '',
				previousTransitionPriority: '',
			};
			elementClassManagers.set(element, manager);

			/** Configurar el observer global si es necesario y registrar este elemento */
			setupGlobalObserver(platformId);
			observedElements.add(element);

			/**
			 * Suprimir las transiciones hasta que el primer effect escriba las clases correctas y
			 * el navegador las haya pintado. Esto previene animaciones de transición CSS
			 * durante la hidratación cuando las clases cambian del estado SSR al estado del cliente.
			 */
			if (isPlatformBrowser(platformId)) {
				manager.previousTransition = element.style.getPropertyValue('transition');
				manager.previousTransitionPriority = element.style.getPropertyPriority('transition');
				element.style.setProperty('transition', 'none', 'important');
				manager.transitionsSuppressed = true;
			}
		}

		/** Asignar el order una sola vez en el momento del registro */
		const sourceOrder = manager.nextOrder++;

		function updateClasses(): void {
			/** Obtener las nuevas clases de la función computed */
			const newClasses = toClassList(computed());

			/** Actualizar las clases de este source, manteniendo el order original */
			manager!.sources.set(sourceId, {
				classes: new Set(newClasses),
				order: sourceOrder,
			});

			/** Actualizar el elemento */
			updateElement(manager!);

			/**
			 * Reactivar las transiciones después de que el primer effect escriba las clases correctas.
			 * Se difiere al siguiente animation frame para que el navegador pinte primero el cambio de
			 * clase con las transiciones deshabilitadas, y luego las reactive.
			 */
			if (manager!.transitionsSuppressed) {
				manager!.transitionsSuppressed = false;
				manager!.restoreRafId = requestAnimationFrame(() => {
					manager!.restoreRafId = null;
					restoreTransitionSuppression(manager!);
				});
			}
		}

		/** Registrar la limpieza con DestroyRef */
		destroyRef.onDestroy(() => {
			if (manager!.restoreRafId !== null) {
				cancelAnimationFrame(manager!.restoreRafId);
				manager!.restoreRafId = null;
			}

			if (manager!.transitionsSuppressed) {
				manager!.transitionsSuppressed = false;
				restoreTransitionSuppression(manager!);
			}

			/** Quitar este source del manager */
			manager!.sources.delete(sourceId);

			/** Si ya no quedan sources, limpiar el manager */
			if (manager!.sources.size === 0) {
				cleanupManager(element);
			} else {
				/** Actualizar el elemento sin las clases de este source */
				updateElement(manager!);
			}
		});

		/**
		 * Necesitamos este effect para rastrear cambios en las clases computadas. Idealmente usaríamos
		 * afterRenderEffect aquí, pero eso no se ejecuta en contextos SSR, así que usamos un effect
		 * estándar que funciona tanto en el navegador como en SSR.
		 */
		effect(updateClasses);
	});
}

function restoreTransitionSuppression(manager: ElementClassManager): void {
	const prev = manager.previousTransition;
	if (prev) {
		manager.element.style.setProperty('transition', prev, manager.previousTransitionPriority || undefined);
	} else {
		manager.element.style.removeProperty('transition');
	}
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function setupGlobalObserver(platformId: Object): void {
	if (isPlatformBrowser(platformId) && !globalObserver) {
		/** Crear un único observer global que vigila todo el documento */
		globalObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const element = mutation.target as HTMLElement;
					const manager = elementClassManagers.get(element);

					/** Solo procesar los elementos que estamos gestionando */
					if (manager && observedElements.has(element)) {
						if (manager.isUpdating) continue; /** Ignorar los cambios que estamos haciendo nosotros */

						/** Actualizar las clases base para incluir cualquier clase agregada externamente */
						const currentClasses = toClassList(element.className);
						const allSourceClasses = new Set<string>();

						/** Recolectar todas las clases de todos los sources */
						for (const source of manager.sources.values()) {
							for (const className of source.classes) {
								allSourceClasses.add(className);
							}
						}

						/** Cualquier clase que no venga de un source se convierte en una nueva clase base */
						manager.baseClasses.clear();

						for (const className of currentClasses) {
							if (!allSourceClasses.has(className)) {
								manager.baseClasses.add(className);
							}
						}

						updateElement(manager);
					}
				}
			}
		});

		/** Comenzar a observar todo el documento en busca de cambios en el atributo class */
		globalObserver.observe(document, {
			attributes: true,
			attributeFilter: ['class'],
			subtree: true, /** Vigilar todos los descendientes */
		});
	}
}

function updateElement(manager: ElementClassManager): void {
	if (manager.isUpdating) return; /** Evitar actualizaciones recursivas */

	manager.isUpdating = true;

	/** Manejar la inicialización: capturar las clases base después del primer registro de source */
	if (!manager.hasInitialized && manager.sources.size > 0) {
		/** Obtener las clases actuales en el elemento (pueden incluir clases SSR) */
		const currentClasses = toClassList(manager.element.className);

		/** Obtener todas las clases que serán aplicadas por los sources */
		const allSourceClasses = new Set<string>();
		for (const source of manager.sources.values()) {
			source.classes.forEach((className) => allSourceClasses.add(className));
		}

		/**
		 * Solo considerar las clases como "base" si no son producidas por ningún source.
		 * Esto evita que las clases renderizadas por SSR se preserven como clases base.
		 */
		currentClasses.forEach((className) => {
			if (!allSourceClasses.has(className)) {
				manager.baseClasses.add(className);
			}
		});

		manager.hasInitialized = true;
	}

	/** Obtener las clases de todos los sources, ordenadas por orden de registro (las últimas tienen precedencia) */
	const sortedSources = Array.from(manager.sources.entries()).sort(([, a], [, b]) => a.order - b.order);

	const allSourceClasses: string[] = [];
	for (const [, source] of sortedSources) {
		allSourceClasses.push(...source.classes);
	}

	/** Combinar las clases base con todas las clases de los sources, asegurando que las clases base tengan precedencia */
	const classesToApply =
		allSourceClasses.length > 0 || manager.baseClasses.size > 0
			? hlm([...allSourceClasses, ...manager.baseClasses])
			: '';

	/** Aplicar las clases al elemento */
	if (manager.element.className !== classesToApply) {
		manager.element.className = classesToApply;
	}

	manager.isUpdating = false;
}

function cleanupManager(element: HTMLElement): void {
	/** Quitar del rastreo global */
	observedElements.delete(element);
	elementClassManagers.delete(element);

	/** Si ya no quedan elementos rastreados, limpiar el observer global */
	if (observedElements.size === 0 && globalObserver) {
		globalObserver.disconnect();
		globalObserver = null;
	}
}

interface ClassesOptions {
	elementRef?: ElementRef<HTMLElement>;
	injector?: Injector;
}

/** Cache para las listas de clases parseadas para evitar operaciones repetidas de strings */
const classListCache = new Map<string, string[]>();

function toClassList(className: string | ClassValue[]): string[] {
	/** Para inputs simples de tipo string, usar el cache para evitar el parseo repetido */
	if (typeof className === 'string' && classListCache.has(className)) {
		return classListCache.get(className)!;
	}

	const result = clsx(className)
		.split(' ')
		.filter((c) => c.length > 0);

	/** Cachear los resultados de string, pero limitar el tamaño del cache para prevenir crecimiento de memoria */
	if (typeof className === 'string' && classListCache.size < 1000) {
		classListCache.set(className, result);
	}

	return result;
}
