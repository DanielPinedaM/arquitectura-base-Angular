import { HlmCarouselComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel.component';
import { HlmCarouselContentDirective } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-content.directive';
import { HlmCarouselItemDirective } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-item.directive';
import { HlmCarouselPreviousComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-previous.component';
import { HlmCarouselNextComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-next.component';
import { HlmCarouselSlideDisplayComponent } from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-slide-display.component';

export * from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-content.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-item.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-next.component';
export * from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-previous.component';
export * from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel-slide-display.component';
export * from '@/shared/design/ui/spartan-ng/data-display/carousel/hlm-carousel.component';

export const HlmCarouselImports = [
	HlmCarouselComponent,
	HlmCarouselContentDirective,
	HlmCarouselItemDirective,
	HlmCarouselPreviousComponent,
	HlmCarouselNextComponent,
	HlmCarouselSlideDisplayComponent,
] as const;
