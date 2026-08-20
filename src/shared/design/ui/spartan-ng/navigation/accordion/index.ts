import { HlmAccordionDirective } from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion.directive';
import { HlmAccordionItemDirective } from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion-item.directive';
import { HlmAccordionContentComponent } from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion-content.component';
import { HlmAccordionTriggerComponent } from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion-trigger.component';

export * from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion-content.component';
export * from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion-item.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion-trigger.component';
export * from '@/shared/design/ui/spartan-ng/navigation/accordion/hlm-accordion.directive';

export const HlmAccordionImports = [
	HlmAccordionDirective,
	HlmAccordionItemDirective,
	HlmAccordionContentComponent,
	HlmAccordionTriggerComponent,
] as const;
