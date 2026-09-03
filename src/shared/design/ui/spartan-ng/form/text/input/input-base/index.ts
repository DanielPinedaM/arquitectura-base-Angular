import { HlmInputDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input.directive';
import { HlmInputBaseComponent } from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input-base.component';

export * from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input.directive';
export * from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input-base.component';

export const HlmInputBaseImports = [
	HlmInputDirective,
	HlmInputBaseComponent,
] as const;
