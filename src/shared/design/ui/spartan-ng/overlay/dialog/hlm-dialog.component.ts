import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { HlmDialogOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-overlay.directive';

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
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog-overlay />
		<ng-content />
	`,
})
export class HlmDialogComponent extends BrnDialog {}
