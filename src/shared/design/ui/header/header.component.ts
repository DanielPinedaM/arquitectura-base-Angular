import { Component, inject } from '@angular/core';
import { ThemeService } from '@/shared/services/Theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
}
