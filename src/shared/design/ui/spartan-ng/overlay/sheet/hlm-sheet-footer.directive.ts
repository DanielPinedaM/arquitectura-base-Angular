import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmSheetFooter],hlm-sheet-footer',
	host: { 'data-slot': 'sheet-footer' },
})
export class HlmSheetFooterDirective {
	constructor() {
		classes(() => 'gap-2 p-4 mt-auto flex flex-col');
	}
}
