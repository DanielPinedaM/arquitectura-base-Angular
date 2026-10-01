import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, PLATFORM_ID, RendererFactory2, Service, signal } from '@angular/core';

type TTheme = 'light' | 'dark';

/** Servicio para tema oscuro y claro  */
@Service()
export class ThemeService {
  private _platformId = inject(PLATFORM_ID);

  private _renderer = inject(RendererFactory2).createRenderer(null, null);

  private _document = inject(DOCUMENT);

  private _theme = signal<TTheme>(this.readThemeFromLocalStorage());

  /**
   * Tema actual de solo lectura. Úsalo solo para lo que CSS no puede resolver, como mostrar
   * el tema elegido o pasarlo a una librería de terceros: los estilos y los iconos que
   * cambian según el tema se resuelven con la variante `dark:` de Tailwind. */
  theme = this._theme.asReadonly();

  constructor() {
    this.toggleClassOnThemeChanges();
    this.syncThemeBetweenTabs();
  }

  private readThemeFromLocalStorage(): TTheme {
    if (!isPlatformBrowser(this._platformId)) return 'light';

    try {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  private syncThemeBetweenTabs(): void {
    if (!isPlatformBrowser(this._platformId)) return;

    this._renderer.listen('window', 'storage', (event: StorageEvent) => {
      if (event.key === 'theme') this._theme.set(event.newValue === 'dark' ? 'dark' : 'light');
    });
  }

  private toggleClassOnThemeChanges(): void {
    effect(() => {
      const enableTransitions = this.disableTransitions();

      if (this._theme() === 'dark') {
        this._renderer.addClass(this._document.documentElement, 'dark');
      } else {
        this._renderer.removeClass(this._document.documentElement, 'dark');
      }

      enableTransitions();
    });
  }

  private disableTransitions(): () => void {
    if (!isPlatformBrowser(this._platformId)) return () => {};

    const style = this._renderer.createElement('style');
    this._renderer.appendChild(
      style,
      this._renderer.createText('*,*::before,*::after{transition:none!important}'),
    );
    this._renderer.appendChild(this._document.head, style);

    return () => {
      window.getComputedStyle(this._document.body);
      setTimeout(() => this._renderer.removeChild(this._document.head, style), 1);
    };
  }

  /**
   * Alterna entre el tema claro y el oscuro desde cualquier parte de la aplicación
   * y guarda el nuevo tema en el `localStorage`. Si el navegador bloquea el `localStorage`,
   * el tema cambia igual, pero no se conserva al recargar. */
  toggleDarkMode(): void {
    this._theme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));

    try {
      localStorage.setItem('theme', this._theme());
    } catch {}
  }
}
