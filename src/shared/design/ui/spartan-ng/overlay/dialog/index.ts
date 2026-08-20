import { HlmDialogComponent } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog.component';
import { HlmDialogContentComponent } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-content.component';
import { HlmDialogDescriptionDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-description.directive';
import { HlmDialogFooterDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-footer.directive';
import { HlmDialogHeaderDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-header.directive';
import { HlmDialogOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-overlay.directive';
import { HlmDialogPortalDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-portal.directive';
import { HlmDialogTitleDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-title.directive';
import { HlmDialogTriggerDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-trigger.directive';
import { HlmDialogCloseDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-close.directive';

export * from '@/shared/design/ui/spartan-ng/overlay/dialog/data-types/constants/hlm-dialog.const';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/data-types/types/hlm-dialog.type';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-close.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-content.component';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-description.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-footer.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-header.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-overlay.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-portal.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-title.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-trigger.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog.component';
export * from '@/shared/design/ui/spartan-ng/overlay/dialog/services/hlm-dialog.service';

export const HlmDialogImports = [
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogFooterDirective,
	HlmDialogHeaderDirective,
	HlmDialogOverlayDirective,
	HlmDialogPortalDirective,
	HlmDialogTitleDirective,
	HlmDialogTriggerDirective,
	HlmDialogCloseDirective,
] as const;
