import { MenuComponent } from '@/shared/design/ui/header/menu.component';
import { ThemeService } from '@/shared/services/Theme.service';
import ToastService from '@/shared/services/Toast.service';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

const PUBLIC_ROUTES: string[] = [
  '/iniciar-sesion',
  '/registrarme',
  '/recuperar-clave',
  '/asignar-nueva-clave',
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [MenuComponent],
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly isMenuOpen = signal<boolean>(false);

  private readonly currentRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly isPublicRoute = computed<boolean>(() =>
    PUBLIC_ROUTES.some((route: string) => this.currentRoute().startsWith(route)),
  );

  protected toggleMenu(): void {
    this.isMenuOpen.update((previousValue: boolean) => !previousValue);
  }

  protected onClickLogOut(): void {
    this.isMenuOpen.set(false);
    this.router.navigate(['/iniciar-sesion']);
    this.toast.info('Se ha cerrado sesión');
  }
}
