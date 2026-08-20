import { CdkMenuTrigger } from '@angular/cdk/menu';
import { computed, Directive, effect, forwardRef, inject, input } from '@angular/core';
import { createMenuPosition, MENU_SIDE, type MenuAlign, type MenuSide } from '@spartan-ng/brain/core';
import { injectHlmDropdownMenuConfig } from '@spartan-ng/hlm-dropdown-menu-helper';

@Directive({
	selector: '[hlmDropdownMenuTrigger]',
	providers: [{ provide: MENU_SIDE, useExisting: forwardRef(() => HlmDropdownMenuTriggerDirective) }],
	hostDirectives: [
		{
			directive: CdkMenuTrigger,
			inputs: ['cdkMenuTriggerFor: hlmDropdownMenuTrigger', 'cdkMenuTriggerData: hlmDropdownMenuTriggerData'],
			outputs: ['cdkMenuOpened: hlmDropdownMenuOpened', 'cdkMenuClosed: hlmDropdownMenuClosed'],
		},
	],
	host: { 'data-slot': 'dropdown-menu-trigger' },
})
export class HlmDropdownMenuTriggerDirective {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	private readonly _config = injectHlmDropdownMenuConfig();

	public readonly align = input<MenuAlign>(this._config.align);
	public readonly side = input<MenuSide>(this._config.side);

	private readonly _menuPosition = computed(() => createMenuPosition(this.align(), this.side()));

	constructor() {
		/**
		 * CDK establece transform-origin en el contenido del menú a partir de la posición resuelta; el contenido
		 * lo lee para animar desde la esquina anclada y para derivar su data-side. El cast tolera @angular/cdk < 21.2
		 * (todavía damos soporte a >=21.0), donde la propiedad está ausente y la asignación es un no-op inofensivo.
		 */
		(this._cdkTrigger as { transformOriginSelector?: string }).transformOriginSelector = '[data-slot="dropdown-menu"]';

		effect(() => {
			this._cdkTrigger.menuPosition = this._menuPosition();
		});
	}
}
