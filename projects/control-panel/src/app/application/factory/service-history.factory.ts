import { Injectable } from '@angular/core';

import { ServiceTableFactoryInterface } from '@domain/interfaces';
import { PaginationConfig, ServiceHistoryModel, ServiceTableModel } from '@domain/models';

@Injectable({
  providedIn: 'root',
})
export class ServiceHistoryFactory implements ServiceTableFactoryInterface<ServiceHistoryModel> {
  /**
   * Returns the columns for the service history table.
   *
   * @return the columns for the service history table
   */
  createColumns(): ServiceTableModel<ServiceHistoryModel>[] {
    return [
      { property: 'serviceName', label: 'Servicio', sortable: true },
      { property: 'status', label: 'Estado', sortable: true },
      { property: 'statusSummary', label: 'Resumen de estado', sortable: false },
      { property: 'lastActivity', label: 'Última actividad', sortable: true },
      { property: 'terminal', label: 'Terminal', sortable: false },
      { property: 'runLog', label: 'RunLog', sortable: false },
    ];
  }

  /**
   * Returns the sorting configuration for the service history table.
   *
   * The columns to sort by are:
   *  - Service name (ascending)
   *  - Status (ascending)
   *  - Last activity (ascending)
   *
   * @return the sorting configuration for the service history table
   */
  createSortingConfig(): { property: keyof ServiceHistoryModel; direction: 'asc' | 'desc'; }[] {
    return [
      { property: 'serviceName', direction: 'asc' },
      { property: 'status', direction: 'asc' },
      { property: 'lastActivity', direction: 'asc' },
    ];
  }

  /**
   * Creates a pagination configuration for the service history table.
   *
   * @param data The data to be paginated
   * @return A pagination configuration
   */
  createPaginationConfig(data: ServiceHistoryModel[]): PaginationConfig {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: data.length,
    };
  }
}
