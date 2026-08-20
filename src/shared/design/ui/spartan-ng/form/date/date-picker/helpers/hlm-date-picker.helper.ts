import { type ExistingProvider, inject, InjectionToken, type Type, type ValueProvider } from '@angular/core';
import {
	HlmDatePickerToken,
	HlmDatePickerTriggerToken,
} from '@spartan-ng/hlm-date-picker-const';
import type {
	HlmDatePickerBase,
	HlmDatePickerConfig,
	HlmDatePickerMultiConfig,
	HlmDatePickerTriggerBase,
	HlmDateRangePickerConfig,
} from '@spartan-ng/hlm-date-picker-interface';

/* ------------------------------------------------------------------ */
/* date picker                                                         */
/* ------------------------------------------------------------------ */

export function provideHlmDatePicker(instance: Type<HlmDatePickerBase<unknown>>): ExistingProvider {
	return { provide: HlmDatePickerToken, useExisting: instance };
}

/**
 * Inyecta el componente date picker.
 */
export function injectHlmDatePicker<T>(): HlmDatePickerBase<T> {
	return inject(HlmDatePickerToken) as HlmDatePickerBase<T>;
}

function getDefaultDatePickerConfig<T>(): HlmDatePickerConfig<T> {
	return {
		formatDate: (date) => (date instanceof Date ? date.toDateString() : `${date}`),
		transformDate: (date) => date,
		parseDate: (value) => {
			const date = new Date(value);
			return isNaN(date.getTime()) ? undefined : (date as T);
		},
		autoCloseOnSelect: false,
	};
}

const HlmDatePickerConfigToken = new InjectionToken<HlmDatePickerConfig<unknown>>('HlmDatePickerConfig');

export function provideHlmDatePickerConfig<T>(config: Partial<HlmDatePickerConfig<T>>): ValueProvider {
	return { provide: HlmDatePickerConfigToken, useValue: { ...getDefaultDatePickerConfig(), ...config } };
}

export function injectHlmDatePickerConfig<T>(): HlmDatePickerConfig<T> {
	const injectedConfig = inject(HlmDatePickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDatePickerConfig<T>) : getDefaultDatePickerConfig();
}

/* ------------------------------------------------------------------ */
/* date picker trigger                                                 */
/* ------------------------------------------------------------------ */

export function provideHlmDatePickerTrigger(instance: Type<HlmDatePickerTriggerBase>): ExistingProvider {
	return { provide: HlmDatePickerTriggerToken, useExisting: instance };
}

/* ------------------------------------------------------------------ */
/* date picker multi                                                   */
/* ------------------------------------------------------------------ */

function getDefaultDatePickerMultiConfig<T>(): HlmDatePickerMultiConfig<T> {
	return {
		formatDates: (dates) => dates.map((date) => (date instanceof Date ? date.toDateString() : `${date}`)).join(', '),
		transformDates: (dates) => dates,
		autoCloseOnMaxSelection: false,
	};
}

const HlmDatePickerMultiConfigToken = new InjectionToken<HlmDatePickerMultiConfig<unknown>>('HlmDatePickerMultiConfig');

export function provideHlmDatePickerMultiConfig<T>(config: Partial<HlmDatePickerMultiConfig<T>>): ValueProvider {
	return { provide: HlmDatePickerMultiConfigToken, useValue: { ...getDefaultDatePickerMultiConfig(), ...config } };
}

export function injectHlmDatePickerMultiConfig<T>(): HlmDatePickerMultiConfig<T> {
	const injectedConfig = inject(HlmDatePickerMultiConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDatePickerMultiConfig<T>) : getDefaultDatePickerMultiConfig();
}

/* ------------------------------------------------------------------ */
/* date range picker                                                   */
/* ------------------------------------------------------------------ */

function getDefaultDateRangePickerConfig<T>(): HlmDateRangePickerConfig<T> {
	return {
		formatDates: (dates) =>
			dates
				.filter(Boolean)
				.map((date) => (date instanceof Date ? date.toDateString() : `${date}`))
				.join(' - '),
		transformDates: (dates) => dates,
		autoCloseOnEndSelection: false,
	};
}

const HlmDateRangePickerConfigToken = new InjectionToken<HlmDateRangePickerConfig<unknown>>('HlmDateRangePickerConfig');

export function provideHlmDateRangePickerConfig<T>(config: Partial<HlmDateRangePickerConfig<T>>): ValueProvider {
	return { provide: HlmDateRangePickerConfigToken, useValue: { ...getDefaultDateRangePickerConfig(), ...config } };
}

export function injectHlmDateRangePickerConfig<T>(): HlmDateRangePickerConfig<T> {
	const injectedConfig = inject(HlmDateRangePickerConfigToken, { optional: true });
	return injectedConfig ? (injectedConfig as HlmDateRangePickerConfig<T>) : getDefaultDateRangePickerConfig();
}
