// Lib
import { Component, inject, OnInit } from '@angular/core';

// Domain
import { ServiceSummaryModel } from '@domain/models';
import { ServiceTableType } from '@domain/interfaces';

// Infrastructure
import { JsonDataService } from '@infrastructure/helpers/json-data.service';

// Presentation
import { ServiceTableComponent } from '@components/ui/service-table/service-table.component';

@Component({
  selector: 'app-service-summary-table',
  standalone: true,
  imports: [
    ServiceTableComponent,
  ],
  templateUrl: './service-summary-table.component.html',
})
export class ServiceSummaryTableComponent implements OnInit {
  MOCK_SERVICE_SUMMARY_DATA: ServiceSummaryModel[] = [];
  tableType: ServiceTableType = ServiceTableType.SERVICE_SUMMARY;

  private readonly jsonService = inject(JsonDataService<ServiceSummaryModel[]>);

  ngOnInit(): void {
    this.jsonService.getData('assets/data/service-summary.json').subscribe(data => {
      this.MOCK_SERVICE_SUMMARY_DATA = data;
    });
  }
}
