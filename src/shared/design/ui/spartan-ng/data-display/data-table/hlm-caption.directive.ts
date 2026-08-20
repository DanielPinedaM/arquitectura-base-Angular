import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

/**
 * Directive para aplicar estilos tipo Shad cn a un elemento <caption>
 * dentro de un contexto HlmTableDirective.
 */
@Directive({
	selector: 'caption[hlmCaption],caption[hlmTableCaption]',
	host: { 'data-slot': 'table-caption' },
})
export class HlmCaptionDirective {
	constructor() {
		classes(() => 'text-muted-foreground mt-4 text-sm');
	}
}
