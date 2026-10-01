import { HeaderComponent } from '@/shared/design/ui/header/header.component';
import { MainMenuComponent } from '@/shared/design/ui/menu/main-menu/main-menu.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  imports: [HeaderComponent, MainMenuComponent, RouterOutlet, CdkScrollable],
})
export class MainWrapperComponent implements OnInit {
  ngOnInit() {}
}
