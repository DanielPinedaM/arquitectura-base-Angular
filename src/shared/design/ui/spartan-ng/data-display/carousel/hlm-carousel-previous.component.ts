import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { HlmButtonDirective, provideBrnButtonConfig } from '@spartan-ng/button';
import { hlm } from '@spartan-ng/hlm-helper';
import { HlmCarouselComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel.component';

@Component({
	selector: 'button[hlm-carousel-previous], button[hlmCarouselPrevious]',
	providers: [provideBrnButtonConfig({ variant: 'outline', size: 'icon-sm' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HlmButtonDirective, inputs: ['variant', 'size'] }],
	host: {
		'data-slot': 'carousel-previous',
		'[disabled]': 'isDisabled()',
		'(click)': '_carousel.scrollPrev()',
	},
	template: `
		<span class="material-symbols-outlined rtl:rotate-180">arrow_back</span>
		<span class="sr-only">Previous slide</span>
	`,
})
export class HlmCarouselPreviousComponent {
	private readonly _button = inject(HlmButtonDirective);

	protected readonly _carousel = inject(HlmCarouselComponent);

	private readonly _computedClass = computed(() =>
		hlm(
			'rounded-full absolute h-8 w-8',
			this._carousel.orientation() === 'horizontal'
				? '-start-12 top-1/2 -translate-y-1/2'
				: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
		),
	);
	protected readonly isDisabled = () => !this._carousel.canScrollPrev();

	constructor() {
		effect(() => {
			const computedClass = this._computedClass();
			untracked(() => this._button.setClass(computedClass));
		});
	}
}
