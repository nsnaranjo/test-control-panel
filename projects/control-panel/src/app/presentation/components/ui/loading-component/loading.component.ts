import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { CheckUserRolesUseCase } from '@application/usecases';
import { AuthorizationService } from '@infrastructure/services';
import { routes } from '@presentation/app.routes';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent implements OnInit {
  public currentStep = '';

  @ViewChild('loading', { static: true }) loading!: ElementRef<HTMLDialogElement>;

  private readonly checkUserRolesUseCase = inject(CheckUserRolesUseCase);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.nativeElement.showModal();

      this.verifyUserRoles();
    });
  }

  private verifyUserRoles(): void {
    this.checkUserRolesUseCase
      .execute()
      .pipe(
        take(1),
        finalize(() => {
          // Cerrar el modal sin retraso adicional una vez terminada la verificación
          this.loading.nativeElement.close();
        })
      )
      .subscribe({
        next: (userRole) => {
          const accessRoutes = userRole.accessRoutes || [];
          const validRoutes = this.authorizationService.validateAccessRoutes(accessRoutes, routes);
          if (userRole.isAccessDenied || !validRoutes) {
            this.currentStep = 'No cuenta con los permisos suficientes, será redireccionado a la página principal de SPAD.';
              this.authorizationService.handleAccessDenied();
            return;
          }

          this.currentStep = 'Sincronizando los servicios. Esto tomará solo un instante...';

          // Determinar la ruta inicial basada en los permisos
          const initialRoute = this.determineInitialRoute(accessRoutes);

          this.router.navigate([initialRoute]);
        },
        error: (error) => {
          this.currentStep = 'No cuenta con los permisos suficientes, será redireccionado a la página principal de SPAD.';
          this.authorizationService.handleAccessDenied();
        },
      });
  }



  private determineInitialRoute(accessRoutes: string[]): string {
    // Si tiene acceso a todas las rutas
    if (accessRoutes.includes('*')) {
      return '/instances';
    }

    // Si tiene acceso específico a instances
    if (accessRoutes.includes('instances')) {
      return '/instances';
    }

    // Si tiene acceso a projects-panel
    if (accessRoutes.includes('projects-panel')) {
      return '/projects-panel';
    }

    // Si no tiene acceso a ninguna ruta específica
    return '/';
  }
}
