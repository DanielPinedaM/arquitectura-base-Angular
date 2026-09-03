import { HlmInputBaseComponent } from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input-base.component';
import { Component, computed, input, model, output } from '@angular/core';
import { transformedValue, type FormValueControl } from '@angular/forms/signals';
import type { ClassValue } from 'clsx';

/**
 * Input numerico: `hlm-input-base` con `type="number"`.
 *
 * El `type="number"` nativo aporta los botones de incremento/decremento.
 * Para decimales, el consumidor define `step` (ejemplo: `step="0.5"`).
 */
@Component({
	selector: 'hlm-input-number',
	imports: [HlmInputBaseComponent],
	host: { class: 'contents', '[attr.id]': 'null' },
	template: `
		<hlm-input-base
			type="number"
			inputMode="decimal"
			[class]="userClass()"
			[id]="inputId()"
			[name]="name()"
			[placeholder]="placeholder()"
			[step]="step()"
			[min]="min()"
			[max]="max()"
			[disabled]="disabled()"
			[readonly]="readonly()"
			[required]="required()"
			[invalid]="_showInvalid()"
			[value]="_rawValue()"
			(valueChange)="_rawValue.set($event)"
			(touch)="touch.emit()"
		/>
	`,
})
export class HlmInputNumberComponent implements FormValueControl<number | null> {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** Valor del campo, sincronizado por la directiva `formField` de signal forms */
	public readonly value = model<number | null>(null);

	public readonly inputId = input<string | undefined>(undefined, { alias: 'id' });

	public readonly placeholder = input<string>('');

	/** Tamaño del incremento/decremento; con decimales permite valores no enteros */
	public readonly step = input<number | string | undefined>(undefined);

	/** Los siguientes inputs los enlaza automaticamente la directiva `formField` */
	public readonly name = input<string>('');

	public readonly min = input<number | undefined>(undefined);

	public readonly max = input<number | undefined>(undefined);

	public readonly disabled = input<boolean>(false);

	public readonly readonly = input<boolean>(false);

	public readonly required = input<boolean>(false);

	public readonly invalid = input<boolean>(false);

	public readonly touched = input<boolean>(false);

	/** Emite el blur para que signal forms marque el campo como touched */
	public readonly touch = output<void>();

	/** El estilo de invalido solo se muestra cuando el usuario ya interactuo con el campo */
	protected readonly _showInvalid = computed(() => this.invalid() && this.touched());

	/** El `<input>` nativo trabaja con string, el modelo del formulario con number */
	protected readonly _rawValue = transformedValue(this.value, {
		parse: (rawValue: string) => {
			if (rawValue === '') return { value: null };

			const parsedValue = Number(rawValue);

			if (Number.isNaN(parsedValue)) {
				return { error: { kind: 'parse', message: `${rawValue} no es un numero` } };
			}

			return { value: parsedValue };
		},
		format: (value: number | null) => value?.toString() ?? '',
	});
}
