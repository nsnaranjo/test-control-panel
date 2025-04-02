// Lib
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from 'ngx-spad-lib-icons';

// Domain
import { PaginationConfig, ServiceTableModel } from '@domain/models';
import { ServiceTableFactoryInterface, ServiceTableType } from '@domain/interfaces';

// Application
import { ServiceTableFactoryService } from '@application/factory';

// Presentation
import {
  ServiceControlButtonsComponent,
} from '@components/ui/service-control-buttons/service-control-buttons.component';
import { StatusIconComponent } from '@components/ui/status-icon/status-icon.component';
import { ModalComponent } from '@components/ui/modal/modal.component';


@Component({
  selector: 'app-service-table',
  standalone: true,
  imports: [
    CommonModule,
    ServiceControlButtonsComponent,
    IconComponent,
    StatusIconComponent,
    ModalComponent
],
  templateUrl: './service-table.component.html',
  styleUrl: './service-table.component.scss',
})
export class ServiceTableComponent<T> implements OnInit, OnChanges {
  @Input() tableType: ServiceTableType | string = '';
  @Input() data: T[] | any[] = [];

  isOpenModal: boolean = false;

  columns: ServiceTableModel<T>[] = [];
  pagination?: PaginationConfig;
  factory!: ServiceTableFactoryInterface<T>;

  private readonly tableFactoryService = inject(ServiceTableFactoryService);
  private readonly router = inject(Router);

  /**
   * The factory is created based on the table type. It is used to create columns and pagination.
   * This is done in ngOnInit to ensure that the factory is created before the component is rendered.
   */
  ngOnInit() {
    this.factory = this.tableFactoryService.getFactory(this.tableType);

    // Create columns based on the factory's definition
    this.columns = this.factory.createColumns();
  }

  /**
   * Called when the component's data input changes.
   *
   * If the new data is not empty and the factory is defined, it calls the factory's
   * `createPaginationConfig` method to create the pagination configuration.
   *
   * @param changes The changes object, which contains the new data.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length > 0 && this.factory) {
      if (this.factory.createPaginationConfig) {
        this.pagination = this.factory.createPaginationConfig(this.data);
      }
    }
  }

  toggleModal() {
    this.isOpenModal = !this.isOpenModal;
  }

  /**
   * Determines if a specific action is allowed based on the current status.
   *
   * @param action - The action to check (e.g., 'start', 'restart', 'stop').
   * @param status - The current status of the service.
   * @returns A boolean indicating whether the action is allowed.
   */
  isActionAllowed(action: string, status: string): boolean {
    if (!status) return true;

    switch (action) {
      case 'start':
        return status !== 'success' && status !== 'warning';
      case 'restart':
        return status !== 'warning';
      case 'stop':
        return status !== 'error';
      default:
        return true;
    }
  }

  restartService(row: T) {
    const rowWithId = row as { id: string, serviceName: string, status: string };

    if (!this.isActionAllowed('restart', rowWithId.status)) {
      console.log(`No se puede reiniciar el servicio: ${rowWithId.serviceName} en estado: ${rowWithId.status}`);
      return;
    }

    alert(`Reiniciando servicio: ${rowWithId.serviceName}`);
  }

  startService(row: T) {
    const rowWithId = row as { id: string, serviceName: string, status: string };

    if (!this.isActionAllowed('start', rowWithId.status)) {
      console.log(`No se puede iniciar el servicio: ${rowWithId.serviceName} en estado: ${rowWithId.status}`);
      return;
    }

    alert(`Iniciando servicio: ${rowWithId.serviceName}`);
  }

  stopService(row: T) {
    const rowWithId = row as { id: string, serviceName: string, status: string };
    if (!this.isActionAllowed('stop', rowWithId.status)) {
      console.log(`No se puede detener el servicio: ${rowWithId.serviceName} en estado: ${rowWithId.status}`);
      return;
    }

    alert(`Deteniendo servicio: ${rowWithId.serviceName}`);
  }

  openTerminal(row: T) {
    const rowWithId = row as { id: string, serviceName: string };
    alert(`Abrir Terminal - ID: ${rowWithId.id}, Servicio: ${rowWithId.serviceName}`);
  }

  viewRunLog(row: T) {
    const rowWithId = row as { id: string, serviceName: string };

    this.router.navigate(['/run-log', rowWithId.id]).catch(error => {
      console.error('Error navigating to run log:', error);
    });
  }

  showObservation(row: any) {
    const rowWithId = row as { id: string, serviceName: string };
    alert(`Ver Observación - ID: ${rowWithId.id}, Servicio: ${rowWithId.serviceName}`);
  }

  /**
   * Returns a slice of the data array based on the pagination configuration.
   * If there is no pagination or it is not the serviceHistory table, returns all data.
   * @returns A slice of the data array.
   */
  getPaginatedData() {
    if (!this.pagination) return this.data;

    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;

    return this.data.slice(startIndex, endIndex);
  }

  //* === Pagination methods ===

  /**
   * Returns an array of numbers representing the total number of pages.
   * Each number in the array represents a page number.
   * If there is no pagination, an empty array is returned.
   * @returns An array of numbers representing the page numbers.
   */
  getPageNumbers(): number[] {
    if (!this.pagination) return [];

    const totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  /**
   * Returns the total number of pages.
   * If there is no pagination, returns 1.
   * @returns The total number of pages.
   */
  getTotalPages(): number {
    if (!this.pagination) return 1;

    return Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
  }

  /**
   * Sets the current page to the given page number.
   * If there is no pagination, it does nothing.
   * @param page The page number to set as the current page.
   */
  changePage(page: number) {
    if (this.pagination) this.pagination.currentPage = page;
  }
}

