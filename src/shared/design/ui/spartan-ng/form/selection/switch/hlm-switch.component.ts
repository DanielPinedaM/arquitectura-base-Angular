import type { BooleanInput } from '@angular/cdk/coercion';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    input,
    linkedSignal,
    output,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnSwitch, type BrnSwitchSize, BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { hlm } from '@spartan-ng/hlm-helper';
import type { ClassValue } from 'clsx';
import { HlmSwitchThumbDirective } from '@/shared/design/ui/spartan-ng/form/selection/switch/hlm-switch-thumb.directive';

export const HLM_SWITCH_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmSwitchComponent),
	multi: true,
};

@Component({
	selector: 'hlm-switch',
	imports: [BrnSwitchThumb, BrnSwitch, HlmSwitchThumbDirective],
	providers: [HLM_SWITCH_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'switch',
		class: 'contents',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
	},
	template: `
		<brn-switch
			[class]="_computedClass()"
			[size]="size()"
			[checked]="checked()"
			(checkedChange)="handleChange($event)"
			(touched)="_onTouched?.()"
			[disabled]="_disabled()"
			[id]="inputId()"
			[aria-label]="ariaLabel()"
			[aria-labelledby]="ariaLabelledby()"
			[aria-describedby]="ariaDescribedby()"
		>
			<brn-switch-thumb hlm />
		</brn-switch>
	`,
})
export class HlmSwitchComponent implements ControlValueAccessor {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 data-[matches-spartan-invalid=true]:ring-destructive/20 dark:data-[matches-spartan-invalid=true]:ring-destructive/40 data-[matches-spartan-invalid=true]:border-destructive dark:data-[matches-spartan-invalid=true]:border-destructive/50 dark:data-unchecked:bg-input/80 rounded-full border border-transparent focus-visible:ring-3 data-[matches-spartan-invalid=true]:ring-3 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] group/switch inline-flex shrink-0 items-center transition-all outline-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
			this.userClass(),
		),
	);

	/** El estado checked del switch. */
	public readonly checkedInput = input<boolean, BooleanInput>(false, { alias: 'checked', transform: booleanAttribute });
	public readonly checked = linkedSignal(this.checkedInput);

	/** Emite cuando cambia el estado checked del switch. */
	public readonly checkedChange = output<boolean>();

	/** El estado disabled del switch. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** El tamaño del switch. */
	public readonly size = input<BrnSwitchSize>('default');

	/** Usado para establecer el id en el elemento brn subyacente. */
	public readonly inputId = input<string | null>(null);

	/** Usado para establecer el atributo aria-label en el elemento brn subyacente. */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Usado para establecer el atributo aria-labelledby en el elemento brn subyacente. */
	public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

	/** Usado para establecer el atributo aria-describedby en el elemento brn subyacente. */
	public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

	protected readonly _disabled = linkedSignal(this.disabled);

	protected _onChange?: ChangeFn<boolean>;
	protected _onTouched?: TouchFn;

	protected handleChange(value: boolean): void {
		this.checked.set(value);
		this._onChange?.(value);
		this.checkedChange.emit(value);
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: boolean): void {
		this.checked.set(Boolean(value));
	}

	registerOnChange(fn: ChangeFn<boolean>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
