import { HlmInputBaseComponent } from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input-base.component';
import { Component, computed, input, model, output } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import type { ClassValue } from 'clsx';

/** Input de texto libre: `hlm-input-base` con `type="text"` */
@Component({
	selector: 'hlm-input-text',
	imports: [HlmInputBaseComponent],
	host: { class: 'contents', '[attr.id]': 'null' },
	template: `
		<hlm-input-base
			type="text"
			[class]="userClass()"
			[id]="inputId()"
			[name]="name()"
			[placeholder]="placeholder()"
			[autocomplete]="autocomplete()"
			[minLength]="minLength()"
			[maxLength]="maxLength()"
			[disabled]="disabled()"
			[readonly]="readonly()"
			[required]="required()"
			[invalid]="_showInvalid()"
			[(value)]="value"
			(touch)="touch.emit()"
		/>
	`,
})
export class HlmInputTextComponent implements FormValueControl<string> {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** Valor del campo, sincronizado por la directiva `formField` de signal forms */
	public readonly value = model<string>('');

	public readonly inputId = input<string | undefined>(undefined, { alias: 'id' });

	public readonly placeholder = input<string>('');

	public readonly autocomplete = input<string>('');

	/** Los siguientes inputs los enlaza automaticamente la directiva `formField` */
	public readonly name = input<string>('');

	public readonly minLength = input<number | undefined>(undefined);

	public readonly maxLength = input<number | undefined>(undefined);

	public readonly disabled = input<boolean>(false);

	public readonly readonly = input<boolean>(false);

	public readonly required = input<boolean>(false);

	public readonly invalid = input<boolean>(false);

	public readonly touched = input<boolean>(false);

	/** Emite el blur para que signal forms marque el campo como touched */
	public readonly touch = output<void>();

	/** El estilo de invalido solo se muestra cuando el usuario ya interactuo con el campo */
	protected readonly _showInvalid = computed(() => this.invalid() && this.touched());
}
