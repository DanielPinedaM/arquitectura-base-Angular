import { HlmTabsDirective } from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs.directive';
import { HlmTabsListDirective } from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-list.directive';
import { HlmTabsTriggerDirective } from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-trigger.directive';
import { HlmTabsContentDirective } from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-content.directive';
import { HlmTabsContentLazyDirective } from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-content-lazy.directive';
import { HlmTabsPaginatedListComponent } from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-paginated-list.component';

export * from '@/shared/design/ui/spartan-ng/navigation/tabs/data-types/constants/hlm-tabs.const';
export * from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-content-lazy.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-content.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-list.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-paginated-list.component';
export * from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs-trigger.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/tabs/hlm-tabs.directive';

export const HlmTabsImports = [
	HlmTabsDirective,
	HlmTabsListDirective,
	HlmTabsTriggerDirective,
	HlmTabsContentDirective,
	HlmTabsContentLazyDirective,
	HlmTabsPaginatedListComponent,
] as const;
