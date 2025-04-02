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
  selector: 'app-service-registry-table',
  standalone: true,
  imports: [
    ServiceTableComponent,
  ],
  templateUrl: './service-registry-table.component.html',
})
export class ServiceRegistryTableComponent implements OnInit {
  MOCK_SERVICE_REGISTRY_DATA: ServiceSummaryModel[] = [];
  tableType: ServiceTableType = ServiceTableType.SERVICE_REGISTRY;

  private readonly jsonService = inject(JsonDataService<ServiceSummaryModel[]>);

  ngOnInit(): void {
    this.jsonService.getData('assets/data/service-registry.json').subscribe(data => {
      this.MOCK_SERVICE_REGISTRY_DATA = data;
    });
  }
}
