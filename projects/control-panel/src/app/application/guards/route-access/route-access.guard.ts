import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CheckUserRolesUseCase } from '@application/usecases';

@Injectable({
  providedIn: 'root',
})
export class RouteAccessGuardService {
  private readonly router = inject(Router);
  private readonly checkUserRolesUseCase = inject(CheckUserRolesUseCase);

  async canActivate(route: any): Promise<boolean> {
    try {
      const userRole = await firstValueFrom(this.checkUserRolesUseCase.execute());
      const accessRoutes = userRole.accessRoutes || [];
      const requestedPath = route.routeConfig.path;

      // Si tiene acceso a todas las rutas
      if (accessRoutes.includes('*')) {
        return true;
      }

      // Obtener la ruta base sin parámetros
      const baseRoute = this.getBaseRoute(requestedPath);

      // Verifica si tiene acceso específico a la ruta solicitada
      if (accessRoutes.includes(baseRoute)) {
        return true;
      }

      // Si no tiene acceso, redirige a la primera ruta disponible
      const firstAvailableRoute = accessRoutes[0];
      if (firstAvailableRoute) {
        await this.router.navigate([`/${firstAvailableRoute}`]);
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  private getBaseRoute(path: string): string {
    // Extrae la ruta base antes de cualquier parámetro
    // Ejemplo: 'run-log/:id' -> 'run-log'
    return path.split('/')[0].split(':')[0].replace(/\/$/, '');
  }
}

export const RouteAccessGuard: CanActivateFn = (route, state) => {
  const guardService = inject(RouteAccessGuardService);
  return guardService.canActivate(route);
};
