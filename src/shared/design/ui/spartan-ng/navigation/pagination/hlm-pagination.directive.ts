import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmPagination],hlm-pagination',
	host: {
		'data-slot': 'pagination',
		role: 'navigation',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class HlmPaginationDirective {
	/** El aria-label para el componente de paginación. */
	public readonly ariaLabel = input<string>('pagination', { alias: 'aria-label' });

	constructor() {
		classes(() => 'mx-auto flex w-full justify-center');
	}
}
