import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/hlm-helper';

@Directive({
	selector: '[hlmDropdownMenuShortcut],hlm-dropdown-menu-shortcut',
	host: { 'data-slot': 'dropdown-menu-shortcut' },
})
export class HlmDropdownMenuShortcutDirective {
	constructor() {
		classes(() => 'text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ms-auto text-xs tracking-widest');
	}
}
