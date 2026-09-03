import { HlmInputBaseComponent } from '@/shared/design/ui/spartan-ng/form/text/input/input-base/hlm-input-base.component';
import { Component, computed, input, model, output, signal } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { HlmInputGroupImports } from '@spartan-ng/input-group';
import { hlm } from '@spartan-ng/hlm-helper';
import type { ClassValue } from 'clsx';

/**
 * Input de contraseña con boton toggle para mostrar/ocultar el valor.
 *
 * El signal `_isValueVisible` solo guarda la visibilidad del valor (estado de UI),
 * nunca el valor del campo: ese lo administra signal forms.
 */
@Component({
	selector: 'hlm-input-password',
	imports: [HlmInputGroupImports, HlmInputBaseComponent],
	host: { class: 'contents', '[attr.id]': 'null' },
	template: `
		<div hlmInputGroup [class]="_computedClass()">
			<hlm-input-base
				dataSlot="input-group-control"
				class="flex-1 rounded-none border-0 bg-transparent pe-1.5 shadow-none ring-0 focus-visible:ring-0 data-[matches-spartan-invalid=true]:ring-0 disabled:bg-transparent dark:bg-transparent dark:disabled:bg-transparent"
				[type]="_isValueVisible() ? 'text' : 'password'"
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

			<div hlmInputGroupAddon align="inline-end">
				<button
					hlmInputGroupButton
					size="icon-xs"
					[disabled]="disabled()"
					[attr.aria-label]="_isValueVisible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
					[attr.aria-pressed]="_isValueVisible()"
					(click)="_toggleValueVisibility()"
				>
					<span class="material-symbols-outlined">
						{{ _isValueVisible() ? 'visibility_off' : 'visibility' }}
					</span>
				</button>
			</div>
		</div>
	`,
})
export class HlmInputPasswordComponent implements FormValueControl<string> {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm(this.userClass()));

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

	/** Estado de UI: si el valor de la contraseña se muestra en texto plano */
	protected readonly _isValueVisible = signal<boolean>(false);

	protected _toggleValueVisibility(): void {
		this._isValueVisible.update((previousValue) => !previousValue);
	}
}
