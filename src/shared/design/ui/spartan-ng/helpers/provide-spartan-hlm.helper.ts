import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

/**
 * Provee configuración por defecto para los componentes de Spartan Helm.
 *
 * Este utility configura el overlay de Angular CDK para deshabilitar el comportamiento
 * `usePopover` introducido en Angular 21, el cual causa que los componentes basados en
 * overlay de CDK (sheets, dialogs, tooltips, etc.) se rendericen por encima de elementos
 * `position: fixed` como `<hlm-toaster>`.
 *
 * @returns {EnvironmentProviders} Environment providers para agregar a la configuración de la aplicación.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideSpartanHlm } from '@spartan-ng/provide-spartan-hlm-helper';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSpartanHlm(),
 *     // ... otros providers
 *   ],
 * };
 * ```
 */
export function provideSpartanHlm(): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: OVERLAY_DEFAULT_CONFIG,
			useValue: { usePopover: false },
		},
	]);
}
