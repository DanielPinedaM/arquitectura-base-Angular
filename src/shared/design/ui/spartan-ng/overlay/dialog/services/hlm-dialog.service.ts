import type { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable, type TemplateRef } from '@angular/core';
import { BrnDialogService, cssClassesToArray } from '@spartan-ng/brain/dialog';
import { HlmDialogContentComponent } from '@/shared/design/ui/spartan-ng/overlay/dialog/hlm-dialog-content.component';
import { hlmDialogOverlayClass } from '@spartan-ng/hlm-dialog-const';
import type { HlmDialogOptions } from '@spartan-ng/hlm-dialog-type';

@Injectable({
	providedIn: 'root',
})
export class HlmDialogService {
	private readonly _brnDialogService = inject(BrnDialogService);

	public open(component: ComponentType<unknown> | TemplateRef<unknown>, options?: Partial<HlmDialogOptions>) {
		const mergedOptions = {
			...(options ?? {}),
			backdropClass: cssClassesToArray(`${hlmDialogOverlayClass} ${options?.backdropClass ?? ''}`),
			context: {
				...(options?.context && typeof options.context === 'object' ? options.context : {}),
				$component: component,
				$dynamicComponentClass: options?.contentClass,
				$showCloseButton: options?.showCloseButton,
			},
		};

		return this._brnDialogService.open(HlmDialogContentComponent, undefined, mergedOptions.context, mergedOptions);
	}
}
