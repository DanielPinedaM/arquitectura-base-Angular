import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { buttonVariants, type ButtonVariants } from '@spartan-ng/button';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmPaginationLink]',
	hostDirectives: [
		{
			directive: RouterLink,
			inputs: [
				'target',
				'queryParams',
				'fragment',
				'queryParamsHandling',
				'state',
				'info',
				'relativeTo',
				'preserveFragment',
				'skipLocationChange',
				'replaceUrl',
				'routerLink: link',
			],
		},
	],
	host: {
		'data-slot': 'pagination-link',
		'[attr.data-active]': 'isActive() ? "true" : null',
		'[attr.aria-current]': 'isActive() ? "page" : null',
	},
})
export class HlmPaginationLinkDirective {
	/** Si el link está activo (es decir, es la página actual). */
	public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	/** El tamaño del botón. */
	public readonly size = input<ButtonVariants['size']>('icon');
	/** El link para navegar a la página. */
	public readonly link = input<RouterLink['routerLink']>();

	constructor() {
		classes(() => [
			'',
			buttonVariants({
				variant: this.isActive() ? 'outline' : 'ghost',
				size: this.size(),
			}),
			this.link() === undefined && 'cursor-pointer',
		]);
	}
}
