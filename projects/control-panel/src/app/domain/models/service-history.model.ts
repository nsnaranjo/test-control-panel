import { BaseServiceTableModel } from '@domain/models/service-table.model';

export interface ServiceHistoryModel extends BaseServiceTableModel {
  controlButtons: boolean;
  terminal: boolean;
  runLog: boolean;
}
