import { Directive } from '@angular/core';
import { HlmTextareaDirective } from '@spartan-ng/textarea';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: 'textarea[hlmInputGroupTextarea]',
	hostDirectives: [HlmTextareaDirective],
	host: { 'data-slot': 'input-group-control' },
})
export class HlmInputGroupTextareaDirective {
	constructor() {
		classes(() => 'rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent data-[matches-spartan-invalid=true]:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1 resize-none');
	}
}
