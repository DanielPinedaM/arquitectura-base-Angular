import { InputModalityDetector } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { Directive, inject } from '@angular/core';

/**
 * @internal
 * Mueve el foco del DOM al elemento del menú sobre el que está el cursor. Los menús de CDK solo mueven el foco
 * con el teclado, así que con un puntero el highlight se quedaría en el último elemento enfocado con el teclado
 * (dejando dos filas resaltadas) y, cuando un submenú se cierra, el foco caería en <body>, la pila de menús
 * reportaría que no hay foco, y todo el dropdown colapsaría. Seguir el puntero con el foco (comportamiento de
 * Radix/shadcn) mantiene un único highlight y mantiene el foco dentro de la pila de menús. setActiveMenuItem
 * también sincroniza el key manager para que la navegación con teclado continúe desde el elemento sobre el que
 * está el cursor.
 *
 * Aplicado como host directive en cada tipo de elemento del dropdown (item, checkbox, radio, sub-trigger).
 */
@Directive({
	selector: '[hlmDropdownMenuFocusOnHover]',
	host: {
		'(mouseenter)': '_focusOnHover()',
	},
})
export class HlmDropdownMenuFocusOnHoverDirective {
	private readonly _cdkMenuItem = inject(CdkMenuItem, { self: true });
	private readonly _parentMenu = inject(CdkMenu, { optional: true });
	private readonly _inputModality = inject(InputModalityDetector);

	protected _focusOnHover(): void {
		/**
		 * Solo omitir hovers sintéticos provenientes de toques táctiles; todo hover real (mouse, o
		 * teclado-y-luego-hover, que deja la modalidad como 'keyboard') debe mover el foco para
		 * mantener un único highlight.
		 */
		if (this._inputModality.mostRecentModality === 'touch' || this._cdkMenuItem.disabled) {
			return;
		}
		this._parentMenu?.setActiveMenuItem(this._cdkMenuItem);
	}
}
