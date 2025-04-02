import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

import { HeaderComponent } from '@components/layout/header/header.component';
import { FooterComponent } from '@components/layout/footer/footer.component';
import { TabNavComponent } from '@components/ui/tab-nav/tab-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FooterComponent,
    TabNavComponent,
    RouterOutlet,
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent{

}
