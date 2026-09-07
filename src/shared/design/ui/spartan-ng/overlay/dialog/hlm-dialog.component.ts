import { HlmDialogOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-overlay.directive';
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';

@Component({
	selector: 'hlm-dialog',
	exportAs: 'hlmDialog',
	imports: [HlmDialogOverlayDirective],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmDialogComponent),
		},
		provideBrnDialogDefaultOptions({
			/** agregar opciones personalizadas aquí */
		}),
	],
	template: `
		<hlm-dialog-overlay />
		<ng-content />
	`,
})
export class HlmDialogComponent extends BrnDialog {}
