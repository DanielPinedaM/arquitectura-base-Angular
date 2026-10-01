import { environment } from '@/environments/environment';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface IUrl {
  id: number;
  text: string;
  url: string;
}

const MENU_STORAGE_KEY: string = 'menu';

const MENU_MOCK: IUrl[] = [
  {
    id: 1,
    text: 'Tareas',
    url: '/tareas',
  },
];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  imports: [RouterLink],
  host: {
    class: 'contents',
  },
})
export class MenuComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly isPublicRoute = input.required<boolean>();
  readonly isMenuOpen = model.required<boolean>();

  protected readonly url = signal<IUrl[]>([]);

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
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

  protected hideMenu(): void {
    this.isMenuOpen.set(false);
  }
}
