import type { BooleanInput } from '@angular/cdk/coercion';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    forwardRef,
    input,
    linkedSignal,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnOverlayState } from '@spartan-ng/brain/overlay';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { HlmCalendarComponent } from '@spartan-ng/calendar';
import { HlmPopoverImports } from '@spartan-ng/popover';
import { HlmDatePickerTriggerToken } from '@spartan-ng/hlm-date-picker-const';
import { HlmDatePickerBase } from '@spartan-ng/hlm-date-picker-interface';
import { injectHlmDatePickerConfig, provideHlmDatePicker } from '@spartan-ng/hlm-date-picker-helper';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePickerComponent),
	multi: true,
};

@Component({
	selector: 'hlm-date-picker',
	imports: [HlmPopoverImports, HlmCalendarComponent],
	providers: [HLM_DATE_PICKER_VALUE_ACCESSOR, provideHlmDatePicker(HlmDatePickerComponent), provideBrnLabelable(HlmDatePickerComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnFieldControl],
	host: { class: 'block' },
	template: `
		<hlm-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_onStateChange($event)">
			<ng-content />

			<hlm-popover-content class="w-fit p-0" *hlmPopoverPortal="let ctx">
				<ng-content select="[hlmDatePickerHeader]" />
				<hlm-calendar
					class="rounded-none border-0"
					[captionLayout]="captionLayout()"
					[date]="_mutableDate()"
					[defaultFocusedDate]="_mutableDate() ?? defaultFocusedDate()"
					[min]="min()"
					[max]="max()"
					[disabled]="_disabled()"
					(dateChange)="_handleChange($event)"
				/>
				<ng-content select="[hlmDatePickerFooter]" />
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class HlmDatePickerComponent<T> implements HlmDatePickerBase<T>, ControlValueAccessor {
	private readonly _config = injectHlmDatePickerConfig<T>();

	public readonly popover = viewChild.required(BrnPopover);

	private readonly _trigger = contentChild(HlmDatePickerTriggerToken);

	/** Mostrar dropdowns para navegar entre meses o años. */
	public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

	/** La fecha mínima que puede seleccionarse.*/
	public readonly min = input<T>();

	/** La fecha máxima que puede seleccionarse. */
	public readonly max = input<T>();

	/** Determina si el date picker está deshabilitado. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** El valor seleccionado. */
	public readonly date = input<T>();

	/** La fecha en la que el calendario enfoca al abrirse por primera vez cuando no hay fecha seleccionada. */
	public readonly defaultFocusedDate = input<T>();

	protected readonly _mutableDate = linkedSignal(this.date);

	/** Si es true, el date picker se cerrará cuando se seleccione una fecha. */
	public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
		transform: booleanAttribute,
	});

	/** Define cómo debe mostrarse la fecha en la UI.  */
	public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

	/** Define cómo debe transformarse la fecha antes de guardarla en el modelo/formulario. */
	public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

	protected readonly _popoverState = signal<BrnOverlayState | null>(null);

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal El estado disabled como readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	public readonly formattedDate = computed(() => {
		const date = this._mutableDate();
		return date ? this.formatDate()(date) : undefined;
	});

	public readonly dateChange = output<T>();

	public readonly labelableId = computed(() => this._trigger()?.triggerId());

	public readonly hasDate = computed(() => !!this._mutableDate());

	protected _onChange?: ChangeFn<T>;
	protected _onTouched?: TouchFn;

	protected _onStateChange(state: BrnOverlayState) {
		this._popoverState.set(state);
		if (state === 'closed') this._onTouched?.();
	}

	protected _handleChange(value: T | undefined) {
		if (this._disabled()) return;
		this.updateDate(value);

		if (this.autoCloseOnSelect()) {
			this._popoverState.set('closed');
		}
	}

	/**
	 * Confirma una fecha al picker. Actualiza el modelo interno, notifica a los
	 * form controls, y emite `dateChange`. A diferencia de `_handleChange`, esto no
	 * cierra el popover - está pensado para ser llamado desde un input de texto que
	 * está parseando valores ingresados por el usuario mientras escribe.
	 */
	public updateDate(value: T | undefined) {
		if (this._disabled()) return;
		const transformedDate = value !== undefined ? this.transformDate()(value) : undefined;

		this._mutableDate.set(transformedDate);
		this._onChange?.(transformedDate as T);
		this.dateChange.emit(transformedDate as T);
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T | null): void {
		this._mutableDate.set(value ? this.transformDate()(value) : undefined);
	}

	public registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public touched(): void {
		this._onTouched?.();
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}

	public open() {
		this._popoverState.set('open');
	}

	public close() {
		this._popoverState.set('closed');
	}

	public reset() {
		this._mutableDate.set(undefined);
		this._onChange?.(undefined as T);
		this.dateChange.emit(undefined as T);
	}
}
