import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'hlm-pagination-ellipsis',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'pagination-ellipsis' },
	template: `
		<span class="material-symbols-outlined">more_horiz</span>
		<span class="sr-only">{{ srOnlyText() }}</span>
	`,
})
export class HlmPaginationEllipsisComponent {
	/** Texto solo para lectores de pantalla del ellipsis */
	public readonly srOnlyText = input<string>('More pages');

	constructor() {
		classes(() => 'size-8 [&_.material-symbols-outlined:not([class*=\'text-\'])]:text-[length:--spacing(4)] flex items-center justify-center');
	}
}
