import { Injectable } from '@angular/core';

import { PaginationConfig, ServiceSummaryModel } from '@domain/models';

import { ServiceSummaryFactory } from '@application/factory/service-summary.factory';

@Injectable({
  providedIn: 'root',
})
export class ServiceRegistryFactory extends ServiceSummaryFactory {

  /**
   * Creates the pagination configuration for the service registry table.
   *
   * @param data the data to be paginated
   * @returns an object containing the pagination configuration
   */
  createPaginationConfig(data: ServiceSummaryModel[]): PaginationConfig {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: data.length,
    };
  }
}
