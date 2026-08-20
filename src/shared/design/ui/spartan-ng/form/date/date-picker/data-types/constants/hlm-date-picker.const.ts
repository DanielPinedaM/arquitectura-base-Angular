import { InjectionToken } from '@angular/core';
import type {
	HlmDatePickerBase,
	HlmDatePickerTriggerBase,
} from '@spartan-ng/hlm-date-picker-interface';

export const HlmDatePickerToken = new InjectionToken<HlmDatePickerBase<unknown>>('HlmDatePickerToken');

export const HlmDatePickerTriggerToken = new InjectionToken<HlmDatePickerTriggerBase>('HlmDatePickerTriggerToken');
