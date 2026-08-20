import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnSheet } from '@spartan-ng/brain/sheet';
import { HlmSheetOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/sheet/hlm-sheet-overlay.directive';

@Component({
	selector: 'hlm-sheet',
	exportAs: 'hlmSheet',
	imports: [HlmSheetOverlayDirective],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => BrnSheet),
		},
		{
			provide: BrnSheet,
			useExisting: forwardRef(() => HlmSheetComponent),
		},
		provideBrnDialogDefaultOptions({
			/** agregar opciones personalizadas aquí */
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet-overlay />
		<ng-content />
	`,
})
export class HlmSheetComponent extends BrnSheet {}
