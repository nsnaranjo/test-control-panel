// Lib
import { Component, inject, OnInit } from '@angular/core';

// Domain
import { ServiceTableType } from '@domain/interfaces';
import { ServiceHistoryModel } from '@domain/models';

// Infrastructure
import { JsonDataService } from '@infrastructure/helpers/json-data.service';

// Presentation
import { ServiceTableComponent } from '@components/ui/service-table/service-table.component';

@Component({
  selector: 'app-service-history-table',
  standalone: true,
  imports: [
    ServiceTableComponent,
  ],
  templateUrl: './service-history-table.component.html',
})
export class ServiceHistoryTableComponent implements OnInit {
  MOCK_SERVICE_HISTORY_DATA: ServiceHistoryModel[] = [];
  tableType: ServiceTableType = ServiceTableType.SERVICE_HISTORY;

  private readonly jsonService = inject(JsonDataService<ServiceHistoryModel[]>);

  ngOnInit(): void {
    this.jsonService.getData('assets/data/service-history.json').subscribe(data => {
      this.MOCK_SERVICE_HISTORY_DATA = data;
    });
  }
}
