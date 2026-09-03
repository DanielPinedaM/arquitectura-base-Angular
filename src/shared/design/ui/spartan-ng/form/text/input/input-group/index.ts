import { HlmInputGroupDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group.directive';
import { HlmInputGroupAddonDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-addon.directive';
import { HlmInputGroupButtonDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-button.directive';
import { HlmInputGroupInputDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-input.directive';
import { HlmInputGroupTextDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-text.directive';
import { HlmInputGroupTextareaDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-textarea.directive';

export * from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-addon.directive';
export * from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-button.directive';
export * from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-input.directive';
export * from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-text.directive';
export * from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group-textarea.directive';
export * from '@/shared/design/ui/spartan-ng/form/text/input/input-group/hlm-input-group.directive';

export const HlmInputGroupImports = [
	HlmInputGroupDirective,
	HlmInputGroupAddonDirective,
	HlmInputGroupButtonDirective,
	HlmInputGroupInputDirective,
	HlmInputGroupTextDirective,
	HlmInputGroupTextareaDirective,
] as const;
