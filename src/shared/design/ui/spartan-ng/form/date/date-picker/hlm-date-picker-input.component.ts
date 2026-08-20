import { BooleanInput } from '@angular/cdk/coercion';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
} from '@angular/core';
import { HlmInputGroupDirective, HlmInputGroupImports } from '@spartan-ng/input-group';
import { HlmDatePickerTriggerBase } from '@spartan-ng/hlm-date-picker-interface';
import { provideHlmDatePickerTrigger } from '@spartan-ng/hlm-date-picker-helper';
import { injectHlmDatePicker, injectHlmDatePickerConfig } from '@spartan-ng/hlm-date-picker-helper';

@Component({
	selector: 'hlm-date-picker-input',
	imports: [HlmInputGroupImports],
	providers: [provideHlmDatePickerTrigger(HlmDatePickerInputComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmInputGroupDirective],
	template: `
		<input
			hlmInputGroupInput
			[value]="_inputValue()"
			[id]="inputId()"
			[placeholder]="placeholder()"
			[disabled]="_disabled()"
			[forceInvalid]="forceInvalid()"
			(click)="_handleClick()"
			(keydown.arrowDown)="_open()"
			(keydown.enter)="_handleEnter($event)"
			(input)="_handleInputChange($event)"
			(blur)="_commitDate()"
		/>
		<hlm-input-group-addon align="inline-end">
			@if (_showClearButton()) {
				<button
					hlmInputGroupButton
					size="icon-xs"
					variant="ghost"
					[attr.aria-label]="clearAriaLabel()"
					(click)="_clear()"
					[disabled]="_disabled()"
				>
					<span class="material-symbols-outlined">close</span>
				</button>
			}
			<button
				hlmInputGroupButton
				size="icon-xs"
				[attr.aria-label]="calendarAriaLabel()"
				(click)="_popover().open()"
				[disabled]="_disabled()"
			>
				<span class="material-symbols-outlined">calendar_month</span>
			</button>
		</hlm-input-group-addon>
	`,
})
export class HlmDatePickerInputComponent<T> implements HlmDatePickerTriggerBase {
	private static _nextId = 0;
	private readonly _host = inject(ElementRef);
	private readonly _datePicker = injectHlmDatePicker<T>();
	private readonly _config = injectHlmDatePickerConfig<T>();

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	public readonly inputId = input(`hlm-date-picker-input-${HlmDatePickerInputComponent._nextId++}`);

	public readonly placeholder = input('');

	public readonly inputValue = input<string>('');

	/**
	 * Parsea el texto del input a un valor de fecha. Retorna `undefined` para
	 * un input inválido - la fecha del picker se limpia mientras se conserva
	 * el texto para que el usuario pueda corregirlo.
	 *
	 * Por defecto usa `parseDate` de `HlmDatePickerConfig`.
	 */
	public readonly parseDate = input<(value: string) => T | undefined>(this._config.parseDate);

	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Mostrar un botón de limpiar que resetea el input y la fecha del picker. Oculto cuando está vacío. */
	public readonly showClear = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Abrir el popover al hacer click en el input. */
	public readonly openOnClick = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Etiqueta accesible para el botón de limpiar. */
	public readonly clearAriaLabel = input<string>('Limpiar fecha');

	/** Etiqueta accesible para el botón trigger del calendario. */
	public readonly calendarAriaLabel = input<string>('Abrir calendario');

	/** @internal Id usado por el contrato del trigger para el labeling. */
	public readonly triggerId = this.inputId;

	/**
	 * Texto mostrado en el input. Refleja el `formattedDate` del picker y el
	 * `inputValue` del padre, y acepta escrituras del usuario mediante `_handleInputChange`.
	 * Los commits solo ocurren en blur / Enter, así que el texto en progreso no se sobrescribe.
	 */
	protected readonly _inputValue = linkedSignal<{ formatted: string | undefined; inputValue: string }, string>({
		source: () => ({
			formatted: this._datePicker.formattedDate(),
			inputValue: this.inputValue(),
		}),
		computation: (source, previous) => {
			/** Primer render: preferir formatted, si no usar inputValue. */
			if (previous === undefined) {
				return source.formatted ?? source.inputValue;
			}

			/** El formattedDate del picker cambió - ajustar al formato canónico. */
			if (source.formatted !== previous.source.formatted) {
				if (source.formatted !== undefined) {
					return source.formatted;
				}
				/**
				 * Limpiado externamente vs. el usuario tiene texto inválido en curso: solo
				 * reflejar la limpieza cuando el texto mostrado estaba sincronizado.
				 */
				return previous.value === previous.source.formatted ? '' : previous.value;
			}

			/** El padre actualizó inputValue - reflejarlo. */
			if (source.inputValue !== previous.source.inputValue) {
				return source.inputValue;
			}

			return previous.value;
		},
	});

	constructor() {
		effect(() => this._popover()?.setOrigin(this._host.nativeElement));
	}

	protected _handleInputChange(event: Event) {
		const text = (event.target as HTMLInputElement).value;
		this._inputValue.set(text);
	}

	protected readonly _showClearButton = computed(() => this.showClear() && this._inputValue().length > 0);

	protected _clear() {
		this._inputValue.set('');
		this._datePicker.updateDate?.(undefined);
		this._datePicker.touched?.();
	}

	protected _handleEnter(event: Event) {
		event.preventDefault();
		this._commitDate();
		this._popover().close();
	}

	protected _commitDate() {
		const value = this._inputValue();

		if (!value) {
			this._datePicker.updateDate?.(undefined);
			this._datePicker.touched?.();
			return;
		}

		/** Parseo inválido: limpiar la fecha del picker, conservar el texto para que el usuario pueda corregirlo. */
		const parsed = this.parseDate()(value);
		this._datePicker.updateDate?.(parsed ?? undefined);
		this._datePicker.touched?.();
	}

	protected _open() {
		this._popover().open();
	}

	protected _handleClick() {
		if (this.openOnClick()) {
			this._open();
		}
	}
}
