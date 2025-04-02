import { Injectable } from '@angular/core';
import { IBaseInstancesModel } from '@domain/models/instances.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstanceService {
  private readonly INSTANCES_KEY = 'instances';
  private readonly NAME_KEY = 'instanceName';
  private readonly instancesSubject = new BehaviorSubject<IBaseInstancesModel[]>(this.loadFromLocalStorage());
  public instances$ = this.instancesSubject.asObservable();

  private readonly activeNameSubject = new BehaviorSubject<string>(this.getActiveInstance());
  activeName$ = this.activeNameSubject.asObservable();

  updateInstances(instances: IBaseInstancesModel[]): void {
    this.instancesSubject.next(instances);
    localStorage.setItem(this.INSTANCES_KEY, JSON.stringify(instances));
  }

  private loadFromLocalStorage(): IBaseInstancesModel[] {
    const storedInstances = localStorage.getItem(this.INSTANCES_KEY);
    return storedInstances ? JSON.parse(storedInstances) : [];
  }

  // Método para actualizar el nombre seleccionado
  selectInstanceName(name: string): void {
    this.activeNameSubject.next(name);
    localStorage.setItem(this.NAME_KEY, name);
  }

  private getActiveInstance(): string {
    const storedName = localStorage.getItem(this.NAME_KEY);

    return storedName ?? '';
  }
}
