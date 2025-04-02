// Lib
import { Component } from '@angular/core';

// Presentation
import { BreadcrumbComponent } from '@components/service-history/breadcrumb/breadcrumb.component';
import {
  ServiceHistoryTableComponent,
} from '@components/service-history/service-history-table/service-history-table.component';

@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ServiceHistoryTableComponent,
  ],
  templateUrl: './service-history.component.html',
  styleUrl: './service-history.component.scss',
})
export class ServiceHistoryComponent {

}
