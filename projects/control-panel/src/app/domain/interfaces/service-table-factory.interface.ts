import { PaginationConfig, ServiceTableModel } from '@domain/models';

export interface ServiceTableFactoryInterface<T> {
  createColumns(): ServiceTableModel<T>[];

  createSortingConfig(): { property: keyof T, direction: 'asc' | 'desc' }[];

  createPaginationConfig?(data: T[]): PaginationConfig;
}

export enum ServiceTableType {
  SERVICE_HISTORY = 'serviceHistory',
  SERVICE_SUMMARY = 'serviceSummary',
  SERVICE_REGISTRY = 'serviceRegistry',
}
