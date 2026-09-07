import { HlmPaginationContentDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-content.directive';
import { HlmPaginationEllipsisComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-ellipsis.component';
import { HlmPaginationItemDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-item.directive';
import { HlmPaginationLinkDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-link.directive';
import { HlmPaginationNextComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-next.component';
import { HlmPaginationPreviousComponent } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-previous.component';
import { HlmPaginationDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination.directive';
import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  numberAttribute,
  untracked,
} from '@angular/core';
import { createPageArray, outOfBoundCorrection } from '@spartan-ng/hlm-pagination-helper';
import { HlmSelectImports } from '@spartan-ng/select';

@Component({
	selector: 'hlm-numbered-pagination',
	imports: [
		HlmPaginationDirective,
		HlmPaginationContentDirective,
		HlmPaginationItemDirective,
		HlmPaginationPreviousComponent,
		HlmPaginationNextComponent,
		HlmPaginationLinkDirective,
		HlmPaginationEllipsisComponent,
		HlmSelectImports,
	],
	template: `
		<div class="flex items-center justify-between gap-2 px-4 py-2">
			<div class="flex items-center gap-1 text-sm text-nowrap text-gray-600">
				<b>{{ totalItems() }}</b>
				total items |
				<b>{{ _lastPageNumber() }}</b>
				pages
			</div>

			<nav hlmPagination>
				<ul hlmPaginationContent>
					@if (showEdges() && !_isFirstPageActive()) {
						<li hlmPaginationItem (click)="goToPrevious()">
							<hlm-pagination-previous />
						</li>
					}

					@for (page of _pages(); track page) {
						<li hlmPaginationItem>
							@if (page === '...') {
								<hlm-pagination-ellipsis />
							} @else {
								<a hlmPaginationLink [isActive]="currentPage() === page" (click)="currentPage.set(page)">
									{{ page }}
								</a>
							}
						</li>
					}

					@if (showEdges() && !_isLastPageActive()) {
						<li hlmPaginationItem (click)="goToNext()">
							<hlm-pagination-next />
						</li>
					}
				</ul>
			</nav>

			<!-- Show Page Size selector -->
			<hlm-select [(value)]="itemsPerPage" class="ml-auto">
				<hlm-select-trigger class="w-fit">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						@for (pageSize of _pageSizesWithCurrent(); track pageSize) {
							<hlm-select-item [value]="pageSize">{{ pageSize }}</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		</div>
	`,
})
export class HlmNumberedPaginationComponent {
	/**
	 * La página actual (activa).
	 */
	public readonly currentPage = model.required<number>();

	/**
	 * El número de elementos por página paginada.
	 */
	public readonly itemsPerPage = model.required<number>();

	/**
	 * El número total de elementos en la colección. Solo es útil cuando
	 * se hace paginación en el servidor, donde el tamaño de la colección
	 * se limita a una sola página retornada por la API del servidor.
	 */
	public readonly totalItems = input.required<number, NumberInput>({
		transform: numberAttribute,
	});

	/**
	 * El número de links de página a mostrar.
	 */
	public readonly maxSize = input<number, NumberInput>(7, {
		transform: numberAttribute,
	});

	/**
	 * Mostrar los botones de primera y última página.
	 */
	public readonly showEdges = input<boolean, BooleanInput>(true, {
		transform: booleanAttribute,
	});

	/**
	 * Los tamaños de página a mostrar.
	 * Por defecto es [10, 20, 50, 100]
	 */
	public readonly pageSizes = input<number[]>([10, 20, 50, 100]);

	protected readonly _pageSizesWithCurrent = computed(() => {
		const pageSizes = this.pageSizes();
		return pageSizes.includes(this.itemsPerPage())
			? pageSizes /** si el tamaño de página actual está incluido, retornar el mismo array */
			: [...pageSizes, this.itemsPerPage()].sort((a, b) => a - b); /** de lo contrario, agregar el tamaño de página actual y ordenar el array */
	});

	protected readonly _isFirstPageActive = computed(() => this.currentPage() === 1);
	protected readonly _isLastPageActive = computed(() => this.currentPage() === this._lastPageNumber());

	protected readonly _lastPageNumber = computed(() => {
		if (this.totalItems() < 1) {
			/**
			 * Cuando hay 0 o menos (un caso de error) elementos, no hay "páginas" como tal,
			 * pero tiene sentido considerar una sola página vacía como la última página.
			 */
			return 1;
		}
		return Math.ceil(this.totalItems() / this.itemsPerPage());
	});

	protected readonly _pages = computed(() => {
		const correctedCurrentPage = outOfBoundCorrection(this.totalItems(), this.itemsPerPage(), this.currentPage());

		if (correctedCurrentPage !== this.currentPage()) {
			/** actualizar la página actual */
			untracked(() => this.currentPage.set(correctedCurrentPage));
		}

		return createPageArray(correctedCurrentPage, this.itemsPerPage(), this.totalItems(), this.maxSize());
	});

	protected goToPrevious(): void {
		this.currentPage.set(this.currentPage() - 1);
	}

	protected goToNext(): void {
		this.currentPage.set(this.currentPage() + 1);
	}

	protected goToFirst(): void {
		this.currentPage.set(1);
	}

	protected goToLast(): void {
		this.currentPage.set(this._lastPageNumber());
	}
}
