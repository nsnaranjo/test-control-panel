import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from 'ngx-spad-lib-icons';
import { Subscription } from 'rxjs';
import { InstanceService } from '../../../services/instance.service';
import { IBaseInstancesModel, IStatus } from '@domain/models/instances.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-instance-nav',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterLink],
  templateUrl: './instance-nav.component.html',
  styleUrl: './instance-nav.component.scss',
})
export class InstanceNavComponent implements OnInit {
  menu: MenuItem[] = [];

  isMenuOpen: boolean = true;
  isActiveInstance: string = '';

  private activeSubscription: Subscription = new Subscription();
  private instancesSubscription: Subscription = new Subscription();

  private readonly instanceActiveStatus = inject(InstanceService);

  // Mapeo entre estado e ícono
  private readonly statusIconMapping: { [key in IStatus]: string } = {
    atención: 'attentive',
    mantenimiento: 'maintenance',
    'en ejecución': 'clip-check',
    fallo: 'clip-error',
    deshabilitado: 'clip-slow',
  };


  ngOnInit(): void {
    this.activeSubscription = this.instanceActiveStatus.activeName$.subscribe((name) => {
      this.isActiveInstance = name;
    });
    this.instancesSubscription = this.instanceActiveStatus.instances$.subscribe((instances: IBaseInstancesModel[]) => {
      this.menu = instances.map((instance) => ({
        label: instance.name,
        icon: this.statusIconMapping[instance.status],
        route: '/service-history',
      }));
    });
  }

  ngOnDestroy(): void {
    // Cancel subscriptions to avoid memory leaks
    this.activeSubscription.unsubscribe();
    this.instancesSubscription.unsubscribe();
  }

  toggleInstanceName(name: string): void {
    this.instanceActiveStatus.selectInstanceName(name);
  }

  toggleSidebar() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
