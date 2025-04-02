export interface ISystem {
  cpu: number;
  storage: number;
  ram: number;
  vram: number;
}

export type IStatus = 'atención' | 'mantenimiento' | 'en ejecución' | 'fallo' | 'deshabilitado';
export type IOrderStatus = 'fallo' | 'atención' | 'mantenimiento' | 'en ejecución' | 'deshabilitado';

export interface IBaseInstancesModel {
  id: string;
  name: string;
  status: IStatus;
  system: ISystem;
  services: number;
  lastActivity: string;
}
export interface IStatusInstances {
  [status: string]: IBaseInstancesModel[];
}
