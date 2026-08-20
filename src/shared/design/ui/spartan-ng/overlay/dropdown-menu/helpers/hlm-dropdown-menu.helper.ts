import { InjectionToken, type ValueProvider, inject } from '@angular/core';
import type { HlmDropdownMenuConfig } from '@spartan-ng/hlm-dropdown-menu-interface';

const defaultConfig: HlmDropdownMenuConfig = {
	align: 'start',
	side: 'bottom',
};

const HlmDropdownMenuConfigToken = new InjectionToken<HlmDropdownMenuConfig>('HlmDropdownMenuConfig');

export function provideHlmDropdownMenuConfig(config: Partial<HlmDropdownMenuConfig>): ValueProvider {
	return { provide: HlmDropdownMenuConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectHlmDropdownMenuConfig(): HlmDropdownMenuConfig {
	return inject(HlmDropdownMenuConfigToken, { optional: true }) ?? defaultConfig;
}
