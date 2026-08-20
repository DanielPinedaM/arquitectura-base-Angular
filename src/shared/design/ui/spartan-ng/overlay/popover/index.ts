import { HlmPopoverDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover.directive';
import { HlmPopoverContentDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-content.directive';
import { HlmPopoverDescriptionDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-description.directive';
import { HlmPopoverHeaderDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-header.directive';
import { HlmPopoverPortalDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-portal.directive';
import { HlmPopoverTitleDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-title.directive';
import { HlmPopoverTriggerDirective } from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-trigger.directive';

export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-content.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-description.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-header.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-portal.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-title.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover-trigger.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/popover/hlm-popover.directive';

export const HlmPopoverImports = [
	HlmPopoverDirective,
	HlmPopoverContentDirective,
	HlmPopoverDescriptionDirective,
	HlmPopoverHeaderDirective,
	HlmPopoverPortalDirective,
	HlmPopoverTitleDirective,
	HlmPopoverTriggerDirective,
] as const;
