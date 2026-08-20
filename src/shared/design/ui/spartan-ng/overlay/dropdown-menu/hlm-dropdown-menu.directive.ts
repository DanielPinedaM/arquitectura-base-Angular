import { type NumberInput } from '@angular/cdk/coercion';
import { CdkMenu } from '@angular/cdk/menu';
import { Directive, ElementRef, inject, input, numberAttribute, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { deriveMenuSideFromTransformOrigin, MENU_SIDE, type MenuSide } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDropdownMenu],hlm-dropdown-menu',
	hostDirectives: [CdkMenu],
	host: {
		'data-slot': 'dropdown-menu',
		'[attr.data-state]': '_state()',
		'[attr.data-side]': '_side()',
		'[style.--side-offset]': 'sideOffset()',
	},
})
export class HlmDropdownMenuDirective {
	private readonly _host = inject(CdkMenu);
	private readonly _elementRef = inject(ElementRef<HTMLElement>);
	/** El trigger provee su side configurado; CDK asigna el injector de este contenido bajo el del trigger. */
	private readonly _menuSide = inject(MENU_SIDE, { optional: true });

	protected readonly _state = signal('open');
	protected readonly _side = signal<MenuSide>(this._menuSide?.side() ?? 'bottom');

	public readonly sideOffset = input<number, NumberInput>(1, { transform: numberAttribute });

	constructor() {
		classes(
			() =>
				'motion-safe:data-open:animate-in motion-safe:data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-32 rounded-lg p-1 shadow-md ring-1 duration-100 my-[--spacing(var(--side-offset))] overflow-x-hidden overflow-y-auto outline-none',
		);

		this.setSideFromTransformOrigin();
		/**
		 * esto es un best effort, pero actualmente no parece funcionar
		 * TODO: encontrar una manera de saber que el host está a punto de cerrarse. podría no ser posible con CDK
		 */
		this._host.closed.pipe(takeUntilDestroyed()).subscribe(() => this._state.set('closed'));
	}

	private setSideFromTransformOrigin() {
		const side = this._menuSide?.side() ?? 'bottom';
		/** CDK establece transform-origin en este elemento de forma síncrona al adjuntarse; leerlo en el siguiente tick y derivar el side */
		setTimeout(() => {
			this._side.set(deriveMenuSideFromTransformOrigin(this._elementRef.nativeElement.style.transformOrigin, side));
		});
	}
}
