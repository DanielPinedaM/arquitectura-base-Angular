import { Directive, input } from '@angular/core';
import { BrnTabsList } from '@spartan-ng/brain/tabs';
import { classes } from '@spartan-ng/hlm-helper';
import { listVariants } from '@spartan-ng/hlm-tabs-const';
import { type VariantProps } from 'class-variance-authority';

type ListVariants = VariantProps<typeof listVariants>;

@Directive({
	selector: '[hlmTabsList],hlm-tabs-list',
	hostDirectives: [BrnTabsList],
	host: {
		'data-slot': 'tabs-list',
		'[attr.data-variant]': 'variant()',
	},
})
export class HlmTabsListDirective {
	public readonly variant = input<ListVariants['variant']>('default');

	constructor() {
		classes(() => listVariants({ variant: this.variant() }));
	}
}
