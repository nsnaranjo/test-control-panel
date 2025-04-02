import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '@components/layout/header/header.component';
import { TabNavComponent } from '@components/ui/tab-nav/tab-nav.component';
import { InstanceNavComponent } from '@components/ui/instance-nav/instance-nav.component';
import { FooterComponent } from '@components/layout/footer/footer.component';

@Component({
  selector: 'app-layout-detail',
  standalone: true,
  imports: [
    HeaderComponent,
    InstanceNavComponent,
    RouterOutlet,
    FooterComponent,
    TabNavComponent,
  ],
  templateUrl: './layout-detail.component.html',
  styleUrl: './layout-detail.component.scss',
})
export class LayoutDetailComponent {

}
