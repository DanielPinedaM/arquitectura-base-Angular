import { environment } from '@/environments/environment';
import { MenuDesktopComponent } from '@/shared/design/ui/menu/menu-desktop/menu-desktop.component';
import { MenuMobileComponent } from '@/shared/design/ui/menu/menu-mobile/menu-mobile.component';
import { ApiResponse } from '@/shared/http-client/data-types/interfaces/http-client.interface';
import SessionStorageService from '@/shared/services/SessionStorage.service';
import ToastService from '@/shared/services/Toast.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface IMenuOptions {
  text: string;
  path: string;
  tooltip: string;
  angularMaterialIcon: string;
}

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  imports: [MenuDesktopComponent, MenuMobileComponent],
})
export class MainMenuComponent implements OnInit {
  storage = inject(SessionStorageService);
  http = inject(HttpClient);
  toast = inject(ToastService);

  menuOptions = signal<IMenuOptions[]>([]);

  ngOnInit() {
    this.listMenu();
  }

  async listMenu(): Promise<void> {
    if (this.storage.search('menu')) {
      this.menuOptions.set(this.storage.listValue('menu'));
      return;
    }

    const { success, data } = await firstValueFrom(
      this.http.post<ApiResponse<IMenuOptions[]>>(`${environment.api}`, {}),
    );

    if (!success) {
      this.menuOptions.set([]);
      this.toast.error('Al mostrar menu');
      return;
    }

    this.menuOptions.set(data);
  }
}
