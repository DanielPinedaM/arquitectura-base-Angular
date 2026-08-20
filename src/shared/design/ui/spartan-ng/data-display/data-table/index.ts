import { HlmCaptionDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-caption.directive';
import { HlmTableContainerDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-table-container.directive';
import { HlmTableDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-table.directive';
import { HlmTBodyDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-tbody.directive';
import { HlmTdDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-td.directive';
import { HlmTFootDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-tfoot.directive';
import { HlmThDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-th.directive';
import { HlmTHeadDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-thead.directive';
import { HlmTrDirective } from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-tr.directive';

export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-caption.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-table-container.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-table.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-tbody.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-td.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-tfoot.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-th.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-thead.directive';
export * from '@/shared/design/ui/spartan-ng/data-display/data-table/hlm-tr.directive';

export const HlmTableImports = [
	HlmCaptionDirective,
	HlmTableContainerDirective,
	HlmTableDirective,
	HlmTBodyDirective,
	HlmTdDirective,
	HlmTFootDirective,
	HlmThDirective,
	HlmTHeadDirective,
	HlmTrDirective,
] as const;
