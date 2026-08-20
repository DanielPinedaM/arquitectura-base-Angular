import { computed, Directive, effect, input, untracked } from '@angular/core';
import { injectCustomClassSettable } from '@spartan-ng/brain/core';
import { BrnDialogOverlay } from '@spartan-ng/brain/dialog';
import { hlmDialogOverlayClass } from '@spartan-ng/hlm-dialog-const';
import { hlm } from '@spartan-ng/hlm-helper';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogOverlay],hlm-dialog-overlay',
	hostDirectives: [BrnDialogOverlay],
})
export class HlmDialogOverlayDirective {
	private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(hlmDialogOverlayClass, this.userClass()));

	constructor() {
		effect(() => {
			const computedClass: string = this._computedClass();
			untracked(() => this._classSettable?.setClassToCustomElement(computedClass));
		});
	}
}
