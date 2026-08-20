import { type Signal } from '@angular/core';
import type { BrnPopover } from '@spartan-ng/brain/popover';

export interface HlmDatePickerBase<T> {
	popover: Signal<BrnPopover>;
	disabledState: Signal<boolean>;
	formattedDate: Signal<string | undefined>;
	hasDate: Signal<boolean>;
	/** Confirmar una fecha al picker (p. ej. desde un input parseado). Pasar `undefined` para limpiar. Opcional. */
	updateDate?(value: T | undefined): void;
	/** usado para ControlValueAccessor */
	touched?(): void;
}

export interface HlmDatePickerConfig<T> {
	/**
	 * Si es true, el date picker se cerrará cuando se seleccione una fecha.
	 */
	autoCloseOnSelect: boolean;

	/**
	 * Define cómo debe mostrarse la fecha en la UI.
	 *
	 * @param date
	 * @returns fecha formateada
	 */
	formatDate: (date: T) => string;

	/**
	 * Define cómo debe transformarse la fecha antes de guardarla en el modelo/formulario.
	 *
	 * @param date
	 * @returns fecha transformada
	 */
	transformDate: (date: T) => T;

	/**
	 * Parsea un string ingresado por el usuario a una fecha.
	 *
	 * @param value el string crudo del input
	 * @returns la fecha parseada, o `undefined` cuando el valor no puede parsearse
	 */
	parseDate: (value: string) => T | undefined;
}

export interface HlmDatePickerTriggerBase {
	triggerId: Signal<string>;
}

export interface HlmDatePickerMultiConfig<T> {
	/**
	 * Si es true, el date picker se cerrará cuando se alcance la selección máxima de fechas.
	 */
	autoCloseOnMaxSelection: boolean;

	/**
	 * Define cómo debe mostrarse la fecha en la UI.
	 *
	 * @param dates
	 * @returns fecha formateada
	 */
	formatDates: (dates: T[]) => string;

	/**
	 * Define cómo debe transformarse la fecha antes de guardarla en el modelo/formulario.
	 *
	 * @param dates
	 * @returns fecha transformada
	 */
	transformDates: (dates: T[]) => T[];
}

export interface HlmDateRangePickerConfig<T> {
	/**
	 * Si es true, el date picker se cerrará cuando se alcance la selección máxima de fechas.
	 */
	autoCloseOnEndSelection: boolean;

	/**
	 * Define cómo debe mostrarse la fecha en la UI.
	 *
	 * @param dates
	 * @returns fecha formateada
	 */
	formatDates: (dates: [T | undefined, T | undefined]) => string;

	/**
	 * Define cómo debe transformarse la fecha antes de guardarla en el modelo/formulario.
	 *
	 * @param dates
	 * @returns fecha transformada
	 */
	transformDates: (dates: [T, T]) => [T, T];
}
