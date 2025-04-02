import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from 'ngx-spad-lib-icons';

import { CheckUserRolesUseCase } from '@application/usecases';

interface TabsItem {
  id: number;
  title: string;
  polygon: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-tab-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, IconComponent, NgOptimizedImage],
  templateUrl: './tab-nav.component.html',
  styleUrl: './tab-nav.component.scss',
})
export class TabNavComponent implements OnInit {
  activeOption: number | null = null;
  showTabs = false;

  private readonly checkUserRolesUseCase = inject(CheckUserRolesUseCase);

  tabs: TabsItem[] = [
    {
      id: 1,
      title: 'Instancias',
      polygon: 'left',
      icon: 'ticket',
      route: '/instances',
    },
    {
      id: 2,
      title: 'Proyectos',
      polygon: 'right',
      icon: 'slide',
      route: '/projects-panel',
    },
  ];

  ngOnInit() {
    this.checkUserRolesUseCase.execute().subscribe({
      next: (userRole) => {
        const accessRoutes = userRole.accessRoutes || [];
        // Mostrar el componente solo si tiene acceso a ambas rutas
        this.showTabs = accessRoutes.includes('*') ||
          (accessRoutes.includes('instances') && accessRoutes.includes('projects-panel'));
      },
      error: () => {
        this.showTabs = false;
      }
    });
  }

  onclick(index: number): void {
    this.activeOption = this.activeOption === index ? null : index;
  }
}
