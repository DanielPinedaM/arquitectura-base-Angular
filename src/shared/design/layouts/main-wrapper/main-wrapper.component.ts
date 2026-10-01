import { HeaderComponent } from '@/shared/design/ui/header/header.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  imports: [HeaderComponent, RouterOutlet, CdkScrollable],
})
export class MainWrapperComponent implements OnInit {
  ngOnInit() {}
}
