export interface ServiceTableModel<T> {
  property: keyof T | string;
  label: string;
  sortable: boolean;
  format?: (value: any) => string;
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface BaseServiceTableModel {
  id: string;
  serviceName: string;
  status: string;
  statusSummary: string;
  lastActivity: string;
}

export interface ServiceResponsibilityModel extends BaseServiceTableModel {
  role: string;
  responsible: string;
  observation: string;
}


