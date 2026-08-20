type Page = number | '...';

/**
 * Verifica que la propiedad instance.currentPage esté dentro de los límites del rango de páginas actual.
 * Si no lo está, retorna un valor correcto para currentPage, o el valor actual si está bien.
 *
 * Copiado del paquete 'ngx-pagination'
 */
export function outOfBoundCorrection(totalItems: number, itemsPerPage: number, currentPage: number): number {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	if (totalPages < currentPage && 0 < totalPages) {
		return totalPages;
	}

	if (currentPage < 1) {
		return 1;
	}

	return currentPage;
}

/**
 * Retorna un array de objetos Page para usar en los controles de paginación.
 *
 * Copiado del paquete 'ngx-pagination'
 */
export function createPageArray(
	currentPage: number,
	itemsPerPage: number,
	totalItems: number,
	paginationRange: number,
): Page[] {
	/** paginationRange podría ser un string si se pasa desde un atributo, por eso se convierte a number. */
	paginationRange = +paginationRange;
	const pages: Page[] = [];

	/**
	 * Retornar 1 como número de página por defecto.
	 * Tiene sentido mostrar 1 en lugar de vacío cuando no hay elementos.
	 */
	const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
	const halfWay = Math.ceil(paginationRange / 2);

	const isStart = currentPage <= halfWay;
	const isEnd = totalPages - halfWay < currentPage;
	const isMiddle = !isStart && !isEnd;

	const ellipsesNeeded = paginationRange < totalPages;
	let i = 1;

	while (i <= totalPages && i <= paginationRange) {
		let label: number | '...';
		const pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
		const openingEllipsesNeeded = i === 2 && (isMiddle || isEnd);
		const closingEllipsesNeeded = i === paginationRange - 1 && (isMiddle || isStart);
		if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
			label = '...';
		} else {
			label = pageNumber;
		}
		pages.push(label);
		i++;
	}

	return pages;
}

/**
 * Dada la posición en la secuencia de links de paginación [i],
 * determina qué número de página corresponde a esa posición.
 *
 * Copiado del paquete 'ngx-pagination'
 */
function calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
	const halfWay = Math.ceil(paginationRange / 2);
	if (i === paginationRange) {
		return totalPages;
	}

	if (i === 1) {
		return i;
	}

	if (paginationRange < totalPages) {
		if (totalPages - halfWay < currentPage) {
			return totalPages - paginationRange + i;
		}
		if (halfWay < currentPage) {
			return currentPage - halfWay + i;
		}
		return i;
	}

	return i;
}
