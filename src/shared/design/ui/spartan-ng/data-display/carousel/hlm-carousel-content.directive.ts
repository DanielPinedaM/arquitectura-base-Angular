import { Directive, inject } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';
import { HlmCarouselComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel.component';

@Directive({
	selector: '[hlmCarouselContent],hlm-carousel-content',
	host: {
		'data-slot': 'carousel-content',
	},
})
export class HlmCarouselContentDirective {
	private readonly _orientation = inject(HlmCarouselComponent).orientation;

	constructor() {
		classes(() => ['flex', this._orientation() === 'horizontal' ? '-ml-4' : '-mt-4 flex-col']);
	}
}
