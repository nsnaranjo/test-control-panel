import { inject, Injectable } from '@angular/core';

import { ServiceTableFactoryInterface, ServiceTableType } from '@domain/interfaces';

import { ServiceHistoryFactory } from '@application/factory/service-history.factory';
import { ServiceSummaryFactory } from '@application/factory/service-summary.factory';
import { ServiceRegistryFactory } from '@application/factory/service-registry.factory';

@Injectable({
  providedIn: 'root',
})
export class ServiceTableFactoryService {
  private readonly factories = new Map<string, ServiceTableFactoryInterface<any>>;

  private readonly serviceHistoryFactory = inject(ServiceHistoryFactory);
  private readonly serviceSummaryFactory = inject(ServiceSummaryFactory);
  private readonly serviceRegistryFactory = inject(ServiceRegistryFactory);

  /**
   * Constructor.
   *
   * Sets up the factories for each type of service table.
   */
  constructor() {
    this.factories.set(ServiceTableType.SERVICE_HISTORY, this.serviceHistoryFactory);
    this.factories.set(ServiceTableType.SERVICE_SUMMARY, this.serviceSummaryFactory);
    this.factories.set(ServiceTableType.SERVICE_REGISTRY, this.serviceRegistryFactory);
  }

  /**
   * Gets the factory for a given service table type.
   * @param type the type of service table
   * @returns the factory for the given type
   */
  getFactory(type: string) {

    const factory = this.factories.get(type);

    if (!factory) throw new Error(`No factory found for ${type}`);

    return factory;
  }
}
