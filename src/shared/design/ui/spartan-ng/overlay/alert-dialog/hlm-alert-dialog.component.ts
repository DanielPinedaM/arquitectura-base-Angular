import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BRN_ALERT_DIALOG_DEFAULT_OPTIONS, BrnAlertDialog } from '@spartan-ng/brain/alert-dialog';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { HlmAlertDialogOverlayDirective } from '@/shared/design/ui/spartan-ng/overlay/alert-dialog/hlm-alert-dialog-overlay.directive';

@Component({
	selector: 'hlm-alert-dialog',
	exportAs: 'hlmAlertDialog',
	imports: [HlmAlertDialogOverlayDirective],
	providers: [
		{
			provide: BrnDialog,
			useExisting: forwardRef(() => HlmAlertDialogComponent),
		},
		provideBrnDialogDefaultOptions({
			...BRN_ALERT_DIALOG_DEFAULT_OPTIONS,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog-overlay />
		<ng-content />
	`,
})
export class HlmAlertDialogComponent extends BrnAlertDialog {}
