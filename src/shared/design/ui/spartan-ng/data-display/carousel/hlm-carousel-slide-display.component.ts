import { HlmCarouselComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel.component';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-carousel-slide-display',
	host: {
		'data-slot': 'carousel-slide-display',
	},
	template: `
		<span class="sr-only">{{ _labelContent() }}</span>
		<div aria-hidden="true" [class]="slideClass()">{{ _currentSlide() }} / {{ _carousel.slideCount() }}</div>
	`,
})
export class HlmCarouselSlideDisplayComponent {
	protected readonly _carousel = inject(HlmCarouselComponent);

	protected readonly _currentSlide = computed(() => this._carousel.currentSlide() + 1);

	public readonly slideClass = input<ClassValue>('text-muted-foreground text-sm');

	/** Texto solo para lectores de pantalla del indicador de slide */
	public readonly label = input<string>('Slide');

	protected readonly _labelContent = computed(() => {
		const currentSlide = this._currentSlide();
		const slideCount = this._carousel.slideCount();
		return `${this.label()} ${currentSlide} of ${slideCount} is displayed`;
	});
}
