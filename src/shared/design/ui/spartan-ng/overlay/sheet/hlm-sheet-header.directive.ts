import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmSheetHeader],hlm-sheet-header',
	host: { 'data-slot': 'sheet-header' },
})
export class HlmSheetHeaderDirective {
	constructor() {
		classes(() => 'gap-0.5 p-4 flex flex-col');
	}
}
