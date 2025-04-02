import { Component, inject, Input, OnInit } from '@angular/core';
import { StatusIconComponent } from '../status-icon/status-icon.component';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from 'ngx-spad-lib-icons';
import { IStatus, ISystem } from '@domain/models/instances.model';
import { InstanceService } from '../../../services/instance.service';

@Component({
  selector: 'app-instance-card',
  standalone: true,
  imports: [NgClass, StatusIconComponent, IconComponent, CommonModule],
  templateUrl: './instance-card.component.html',
  styleUrl: './instance-card.component.scss',
})
export class InstanceCardComponent implements OnInit {
  @Input() instanceName: string = 'Spad-instance';
  @Input() status!: IStatus;
  @Input() system: ISystem = {
    cpu: 0,
    storage: 0,
    ram: 0,
    vram: 0,
  };

  @Input() services: number = 0;
  @Input() lastActivity: string = '2 días';

  containerClass: string = '';
  instanceImg: string = '';
  statusImg: string = '';
  statusClass: string = '';

  private readonly router = inject(Router);
  private readonly instanceActive = inject(InstanceService);

  /**
   * Angular lifecycle method that is executed when the component is initialized.
   * Calls the `setClass` method to assign classes and images based on state.
   */
  ngOnInit(): void {
    this.setClass();
  }

  /**
   * Assigns the corresponding class and images based on the state of the instance.
   * @returns Corresponding image about status
   */
  private setClass(): string {

    switch (this.status) {
      case 'fallo':
        this.statusImg = 'assets/status/error-background.webp';
        this.containerClass = 'card__failure';
        this.statusClass = 'card__instance-data--failure';
        break;
      case 'atención':
        this.statusImg = 'assets/status/attention-background.webp';
        this.containerClass = 'card__attention';
        this.statusClass = 'card__instance-data--attention';
        break;
      case 'mantenimiento':
        this.statusImg = 'assets/status/maintenance-background.webp';
        this.containerClass = 'card__maintenance';
        this.statusClass = 'card__instance-data--maintenance';
        break;
      case 'en ejecución':
        this.statusImg = 'assets/status/running-background.webp';
        this.containerClass = 'card__running';
        this.statusClass = 'card__instance-data--running';
        break;
      default:
        this.statusImg = 'assets/status/disabled-background.webp';
        this.containerClass = 'card__disabled';
        this.statusClass = 'card__instance-data--disabled';
        break;
    }

    return this.statusImg && this.containerClass;
  }

  /**
   * Navigate to the service history page and set the name of the active instance.
   */
  onSelectedInstance(instance: string): void {
    this.instanceActive.selectInstanceName(instance)
    this.router.navigate(['/service-history']);
  }
}
