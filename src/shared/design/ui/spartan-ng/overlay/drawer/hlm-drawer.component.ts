import { HlmDrawerOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/drawer/hlm-drawer-overlay.directive';
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from '@spartan-ng/brain/drawer';

@Component({
	selector: 'hlm-drawer',
	exportAs: 'hlmDrawer',
	imports: [HlmDrawerOverlayDirective],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmDrawerComponent),
		},
		{
			provide: BrnDrawer,
			useExisting: forwardRef(() => HlmDrawerComponent),
		},
		provideBrnDialogDefaultOptions({
			/** agregar opciones personalizadas aquí */
		}),
	],
	template: `
		<hlm-drawer-overlay />
		<ng-content />
	`,
})
export class HlmDrawerComponent extends BrnDrawer {}
