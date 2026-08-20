import { Directive } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/input';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: 'input[hlmInputGroupInput]',
	hostDirectives: [HlmInputDirective],
	host: { 'data-slot': 'input-group-control' },
})
export class HlmInputGroupInputDirective {
	constructor() {
		classes(() => `rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent data-[matches-spartan-invalid=true]:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1`);
	}
}
