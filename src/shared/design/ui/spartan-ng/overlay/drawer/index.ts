import { HlmDrawerComponent } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer.component';
import { HlmDrawerCloseDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-close.directive';
import { HlmDrawerContentComponent } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-content.component';
import { HlmDrawerDescriptionDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-description.directive';
import { HlmDrawerFooterDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-footer.directive';
import { HlmDrawerHeaderDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-header.directive';
import { HlmDrawerOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-overlay.directive';
import { HlmDrawerPortalDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-portal.directive';
import { HlmDrawerTitleDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-title.directive';
import { HlmDrawerTriggerDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-trigger.directive';

export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-close.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-content.component';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-description.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-footer.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-header.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-overlay.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-portal.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-title.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-trigger.directive';
export * from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer.component';

export const HlmDrawerImports = [
	HlmDrawerComponent,
	HlmDrawerCloseDirective,
	HlmDrawerContentComponent,
	HlmDrawerDescriptionDirective,
	HlmDrawerFooterDirective,
	HlmDrawerHeaderDirective,
	HlmDrawerOverlayDirective,
	HlmDrawerPortalDirective,
	HlmDrawerTitleDirective,
	HlmDrawerTriggerDirective,
] as const;
