import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import { ThemeService } from '@/shared/services/Theme.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, firstValueFrom, map } from 'rxjs';

interface IUrl {
  id: number;
  text: string;
  url: string;
}

/** Rutas antes de iniciar sesión: en ellas no se muestra el botón del menú */
const PUBLIC_ROUTES: string[] = [
  '/iniciar-sesion',
  '/registrarme',
  '/recuperar-clave',
  '/asignar-nueva-clave',
];

const MENU_STORAGE_KEY: string = 'menu';

// TODO: borrar MENU_MOCK cuando exista el endpoint que lista las opciones del menú
const MENU_MOCK: IUrl[] = [
  {
    id: 1,
    text: 'Tareas',
    url: '/tareas',
  },
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink],
})
export class HeaderComponent implements OnInit {
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  protected readonly url = signal<IUrl[]>([]);
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

  // la petición del menú solo se ejecuta la primera vez, las siguientes veces se carga del localStorage
  ngOnInit(): void {
    if (this.isPublicRoute()) return;

    const menu: IUrl[] | null = this.readMenuFromStorage();

    if (menu) {
      this.url.set(menu);
    } else {
      this.listUrl();
    }
  }

  private async listUrl(): Promise<void> {
    const { success, data } = await firstValueFrom(
      this.http.get<ApiResponse<IUrl[]>>(`${environment.api}`),
    );

    if (!success) {
      console.error('❌ error en la llamada al endpoint que lista las opciones del menu');
      // TODO: borrar esta línea cuando exista el endpoint que lista las opciones del menú
      this.url.set(MENU_MOCK);
      return;
    }

    this.saveMenuInStorage(data ?? []);
    this.url.set(data ?? []);
  }

  /** Lee las opciones del menú guardadas en el localStorage. Devuelve null si no existen o si el navegador bloquea el localStorage */
  private readMenuFromStorage(): IUrl[] | null {
    try {
      const menu: string | null = localStorage.getItem(MENU_STORAGE_KEY);

      return menu ? JSON.parse(menu) : null;
    } catch {
      return null;
    }
  }

  private saveMenuInStorage(menu: IUrl[]): void {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
    } catch {}
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((previousValue: boolean) => !previousValue);
  }

  protected hideMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected onClickLogOut(): void {
    this.hideMenu();
    this.router.navigate(['/iniciar-sesion']);
    this.toast.info('Se ha cerrado sesión');
  }
}
