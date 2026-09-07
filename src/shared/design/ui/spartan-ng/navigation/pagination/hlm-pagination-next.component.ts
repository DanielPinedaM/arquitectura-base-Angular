import { HlmPaginationLinkDirective } from '@/shared/design/ui/spartan-ng/navigation/pagination/hlm-pagination-link.directive';
import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { RouterLink } from '@angular/router';
import type { ButtonVariants } from '@spartan-ng/button';
import { hlm } from '@spartan-ng/hlm-helper';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-pagination-next',
	imports: [HlmPaginationLinkDirective],
	template: `
		<a
			hlmPaginationLink
			[class]="_computedClass()"
			[link]="link()"
			[queryParams]="queryParams()"
			[queryParamsHandling]="queryParamsHandling()"
			[size]="_size()"
			[attr.aria-label]="ariaLabel()"
		>
			<span [class]="_labelClass()">{{ text() }}</span>
			<span class="material-symbols-outlined rtl:rotate-180">chevron_right</span>
		</a>
	`,
})
export class HlmPaginationNextComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	/** El link para navegar a la página siguiente. */
	public readonly link = input<RouterLink['routerLink']>();
	/** Los query parameters a pasar a la página siguiente. */
	public readonly queryParams = input<RouterLink['queryParams']>();
	/** Cómo manejar los query parameters al navegar a la página siguiente. */
	public readonly queryParamsHandling = input<RouterLink['queryParamsHandling']>();

	/** El aria-label para el link de la página siguiente. */
	public readonly ariaLabel = input<string>('Go to next page', { alias: 'aria-label' });
	/** El texto a mostrar para el link de la página siguiente. */
	public readonly text = input<string>('Next');
	/** Si el botón debe mostrar solo el icono. */
	public readonly iconOnly = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});
	protected readonly _labelClass = computed(() => (this.iconOnly() ? 'sr-only' : 'hidden sm:block'));

	protected readonly _size = computed<ButtonVariants['size']>(() => (this.iconOnly() ? 'icon' : 'default'));

	protected readonly _computedClass = computed(() =>
		hlm(!this.iconOnly() && 'pe-1.5!', this.userClass()),
	);
}
