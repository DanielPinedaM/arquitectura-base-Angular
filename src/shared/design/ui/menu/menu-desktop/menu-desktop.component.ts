import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { HlmTooltipImports } from '@spartan-ng/tooltip';

import ToastService from '@/shared/services/Toast.service';

interface IMenuOptions {
  text: string;
  path: string;
  tooltip: string;
  angularMaterialIcon: string;
}

@Component({
  selector: 'app-menu-desktop',
  templateUrl: './menu-desktop.component.html',
  imports: [CommonModule, RouterModule, HlmTooltipImports],
})
export class MenuDesktopComponent {
  readonly router = inject(Router);
  readonly toast = inject(ToastService);

  readonly showText = signal<boolean>(false);

  readonly currentRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    {
      initialValue: this.router.url,
    },
  );

  readonly menuOptions = input.required<IMenuOptions[]>();

  onClickMinimizeOrMaximizeMenu(): void {
    this.showText.update((previousValue) => !previousValue);
  }

  onClickLogOut(): void {
    this.router.navigate(['/iniciar-sesion']);
    this.toast.error('Se ha cerrado sesión');
  }
}
