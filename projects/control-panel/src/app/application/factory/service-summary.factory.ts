import { Injectable } from '@angular/core';

import { ServiceTableFactoryInterface } from '@domain/interfaces';
import { ServiceSummaryModel, ServiceTableModel } from '@domain/models';

@Injectable({
  providedIn: 'root',
})
export class ServiceSummaryFactory implements ServiceTableFactoryInterface<ServiceSummaryModel> {
  /**
   * Returns the columns for the service summary table.
   *
   * @returns an array of ServiceTableModel objects, each representing a column
   *          in the table.
   */
  createColumns(): ServiceTableModel<ServiceSummaryModel>[] {
    return [
      { property: 'status', label: 'Estado', sortable: true },
      { property: 'lastActivity', label: 'Última actividad', sortable: true },
      { property: 'role', label: 'Rol', sortable: false },
      { property: 'responsible', label: 'Responsable', sortable: false },
      { property: 'observation', label: 'Observación', sortable: false },
    ];
  }

  /**
   * Returns the sorting configuration for the service summary table.
   *
   * The columns to sort by are:
   *  - Status (ascending)
   *  - Last activity (ascending)
   *
   * @returns an array of objects, each representing a column that should be
   *          sorted in ascending or descending order.
   */
  createSortingConfig(): { property: keyof ServiceSummaryModel; direction: 'asc' | 'desc'; }[] {
    return [
      { property: 'status', direction: 'asc' },
      { property: 'lastActivity', direction: 'asc' },
    ];
  }
}
