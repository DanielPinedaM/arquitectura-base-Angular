import { HeaderComponent } from '@/shared/design/ui/header/header.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-auth',
  templateUrl: './main-auth.component.html',
  imports: [HeaderComponent, RouterOutlet],
})
export class MainAuthComponent {}
