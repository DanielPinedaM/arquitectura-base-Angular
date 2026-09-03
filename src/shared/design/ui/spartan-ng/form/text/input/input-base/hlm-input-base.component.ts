import { HlmInputDirective } from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input.directive';
import { booleanAttribute, Component, computed, input, model, output } from '@angular/core';
import type { BooleanInput } from '@angular/cdk/coercion';
import { hlm } from '@spartan-ng/hlm-helper';
import type { ClassValue } from 'clsx';

/** Tipos de `<input>` nativo que acepta el input base */
export type HlmInputBaseType =
	| 'text'
	| 'number'
	| 'email'
	| 'tel'
	| 'url'
	| 'search'
	| 'password'
	| 'color';

/**
 * Input base: renderiza el `<input>` nativo y recibe `type` como input.
 *
 * PROHIBIDO usarlo fuera de `src/shared`: solo existe para construir
 * `hlm-input-text`, `hlm-input-number`, `hlm-input-password` y `hlm-input-email`.
 */
@Component({
	selector: 'hlm-input-base',
	imports: [HlmInputDirective],
	host: { class: 'contents', '[attr.id]': 'null' },
	template: `
		<input
			hlmInput
			[type]="type()"
			[id]="inputId()"
			[class]="_computedClass()"
			[attr.data-slot]="dataSlot()"
			[value]="value()"
			[disabled]="disabled()"
			[readOnly]="readonly()"
			[required]="required()"
			[forceInvalid]="invalid()"
			[attr.name]="name() || null"
			[attr.placeholder]="placeholder() || null"
			[attr.autocomplete]="autocomplete() || null"
			[attr.inputmode]="inputMode() || null"
			[attr.step]="step() ?? null"
			[attr.min]="min() ?? null"
			[attr.max]="max() ?? null"
			[attr.minlength]="minLength() ?? null"
			[attr.maxlength]="maxLength() ?? null"
			(input)="_handleInput($event)"
			(blur)="touch.emit()"
		/>
	`,
})
export class HlmInputBaseComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm(this.userClass()));

	/** Tipo del `<input>` nativo */
	public readonly type = input<HlmInputBaseType>('text');

	/** Marca el `<input>` como control de un `hlmInputGroup` cuando vale `input-group-control` */
	public readonly dataSlot = input<'input' | 'input-group-control'>('input');

	/** Valor del `<input>` nativo, siempre como string */
	public readonly value = model<string>('');

	/** Usado para establecer el id en el `<input>` nativo */
	public readonly inputId = input<string | undefined>(undefined, { alias: 'id' });

	/** El atributo name del `<input>` nativo */
	public readonly name = input<string>('');

	public readonly placeholder = input<string>('');

	public readonly autocomplete = input<string>('');

	public readonly inputMode = input<string>('');

	public readonly step = input<number | string | undefined>(undefined);

	public readonly min = input<number | string | undefined>(undefined);

	public readonly max = input<number | string | undefined>(undefined);

	public readonly minLength = input<number | undefined>(undefined);

	public readonly maxLength = input<number | undefined>(undefined);

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly readonly = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Fuerza el estado visual de invalido */
	public readonly invalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Emite cuando el `<input>` nativo pierde el foco */
	public readonly touch = output<void>();

	protected _handleInput(event: Event): void {
		this.value.set((event.target as HTMLInputElement).value);
	}
}
