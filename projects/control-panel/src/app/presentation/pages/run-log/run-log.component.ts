import { Component } from '@angular/core';

// Presentation
import { BreadcrumbComponent } from '@components/service-history/breadcrumb/breadcrumb.component';
import { ServiceControlsComponent } from '@components/run-log/service-controls/service-controls.component';
import { StatisticsComponent } from '@components/run-log/statistics/statistics.component';

@Component({
  selector: 'app-run-log',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ServiceControlsComponent,
    StatisticsComponent,
  ],
  templateUrl: './run-log.component.html',
  styleUrl: './run-log.component.scss'
})
export class RunLogComponent {

}
