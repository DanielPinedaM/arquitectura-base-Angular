import { HlmPaginationDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination.directive';
import { HlmPaginationContentDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-content.directive';
import { HlmPaginationItemDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-link.directive';
import { HlmPaginationPreviousComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-previous.component';
import { HlmPaginationNextComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-next.component';
import { HlmPaginationEllipsisComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-ellipsis.component';
import { HlmNumberedPaginationComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-numbered-pagination.component';
import { HlmNumberedPaginationQueryParamsComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-numbered-pagination-query-params.component';

export * from '@/shared/design/ui/spartan-ng/navigation/pagination/helpers/hlm-pagination.helper';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-numbered-pagination-query-params.component';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-numbered-pagination.component';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-content.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-ellipsis.component';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-item.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-link.directive';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-next.component';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-previous.component';
export * from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination.directive';

export const HlmPaginationImports = [
	HlmPaginationDirective,
	HlmPaginationContentDirective,
	HlmPaginationItemDirective,
	HlmPaginationLinkDirective,
	HlmPaginationPreviousComponent,
	HlmPaginationNextComponent,
	HlmPaginationEllipsisComponent,
	HlmNumberedPaginationComponent,
	HlmNumberedPaginationQueryParamsComponent,
] as const;
