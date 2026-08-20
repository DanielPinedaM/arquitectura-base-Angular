import { CdkMenuTrigger } from '@angular/cdk/menu';
import { computed, Directive, effect, forwardRef, inject, input } from '@angular/core';
import { createMenuPosition, MENU_SIDE, type MenuAlign, type MenuSide } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/hlm-helper';
import { injectHlmDropdownMenuConfig } from '@spartan-ng/hlm-dropdown-menu-helper';

@Directive({
	selector: '[hlmDropdownMenuSubTrigger]',
	providers: [{ provide: MENU_SIDE, useExisting: forwardRef(() => HlmDropdownMenuSubTriggerDirective) }],
	hostDirectives: [
		{
			directive: CdkMenuTrigger,
			inputs: ['cdkMenuTriggerFor: hlmDropdownMenuSubTrigger', 'cdkMenuTriggerData: hlmDropdownMenuTriggerData'],
			outputs: ['cdkMenuOpened: hlmDropdownMenuSubOpened', 'cdkMenuClosed: hlmDropdownMenuSubClosed'],
		},
	],
	host: { 'data-slot': 'dropdown-menu-sub-trigger' },
})
export class HlmDropdownMenuSubTriggerDirective {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	private readonly _config = injectHlmDropdownMenuConfig();

	public readonly align = input<MenuAlign>(this._config.align);
	public readonly side = input<MenuSide>(this._config.side);

	private readonly _menuPosition = computed(() => createMenuPosition(this.align(), this.side()));

	constructor() {
		/**
		 * CDK establece transform-origin en el contenido del submenú a partir de la posición resuelta; el contenido
		 * lo lee para animar desde la esquina anclada y para derivar su data-side. El cast tolera @angular/cdk < 21.2
		 * (todavía damos soporte a >=21.0), donde la propiedad está ausente y la asignación es un no-op inofensivo.
		 */
		(this._cdkTrigger as { transformOriginSelector?: string }).transformOriginSelector =
			'[data-slot="dropdown-menu-sub"]';

		effect(() => {
			this._cdkTrigger.menuPosition = this._menuPosition();
		});

		classes(() => 'aria-expanded:bg-accent aria-expanded:text-accent-foreground');
	}
}
