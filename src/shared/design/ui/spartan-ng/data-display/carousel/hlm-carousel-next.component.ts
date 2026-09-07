import { HlmCarouselComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel.component';
import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { HlmButtonDirective, provideBrnButtonConfig } from '@spartan-ng/button';
import { hlm } from '@spartan-ng/hlm-helper';

@Component({
	selector: 'button[hlm-carousel-next], button[hlmCarouselNext]',
	providers: [provideBrnButtonConfig({ variant: 'outline', size: 'icon-sm' })],
	hostDirectives: [{ directive: HlmButtonDirective, inputs: ['variant', 'size'] }],
	host: {
		'data-slot': 'carousel-next',
		'[disabled]': 'isDisabled()',
		'(click)': '_carousel.scrollNext()',
	},
	template: `
		<span class="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
		<span class="sr-only">Next slide</span>
	`,
})
export class HlmCarouselNextComponent {
	private readonly _button = inject(HlmButtonDirective);
	protected readonly _carousel = inject(HlmCarouselComponent);
	private readonly _computedClass = computed(() =>
		hlm(
			'rounded-full absolute h-8 w-8',
			this._carousel.orientation() === 'horizontal'
				? '-end-12 top-1/2 -translate-y-1/2'
				: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
		),
	);
	protected readonly isDisabled = () => !this._carousel.canScrollNext();

	constructor() {
		effect(() => {
			const computedClass = this._computedClass();

			untracked(() => this._button.setClass(computedClass));
		});
	}
}
