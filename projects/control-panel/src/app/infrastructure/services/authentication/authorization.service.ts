import { inject, Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { CheckUserRolesUseCase } from '@application/usecases';
import { AuthService } from '@infrastructure/services';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private readonly rolesCheckedSubject = new BehaviorSubject<boolean>(false);

  private readonly checkUserRolesUseCase = inject(CheckUserRolesUseCase)
  private readonly authService = inject(AuthService)

  async checkUserAuthorization(routes: Routes): Promise<boolean> {
    try {
      // console.log('AuthorizationService: Iniciando verificación de autorización');

      // Convertir a Promise para manejar la suscripción
      const userRole = await firstValueFrom(this.checkUserRolesUseCase.execute());

      // console.log('AuthorizationService: Resultado de roles de usuario:', userRole);

      if (userRole.isAccessDenied) {
        // console.log('AuthorizationService: Acceso denegado:', userRole);
        this.handleAccessDenied();
        return false;
      }

      const validRoutes = this.validateAccessRoutes(userRole.accessRoutes || [], routes);

      if (!validRoutes) {
        // console.log('AuthorizationService: Rutas no válidas');
        this.handleAccessDenied();
        return false;
      }

      this.rolesCheckedSubject.next(true);
      // console.log('AuthorizationService: Autorización exitosa');
      return true;
    } catch (error) {
      // console.error('AuthorizationService: Error al verificar autorización:', error);
      this.handleAccessDenied();
      return false;
    }
  }

  validateAccessRoutes(userAccessRoutes: string[], appRoutes: Routes): boolean {
    // console.log('Validando rutas de acceso:', userAccessRoutes);

    // Si el usuario tiene acceso a todas las rutas (*), permitir acceso
    if (userAccessRoutes.includes('*')) {
      // console.log('Usuario tiene acceso a todas las rutas');
      return true;
    }

    const definedRoutes = this.extractRoutePathsFromConfig(appRoutes);
    // console.log('Rutas definidas en la aplicación:', definedRoutes);

    // Verificar si alguna de las rutas del usuario coincide con las rutas definidas
    // console.log('Resultado de validación de rutas:', hasAccess);
    return userAccessRoutes.some(userRoute =>
      definedRoutes.some(appRoute =>
        // Usar coincidencia exacta o comprobar si es una ruta anidada
        appRoute === userRoute || appRoute.startsWith(`${userRoute}/`)
      )
    );
  }

  private extractRoutePathsFromConfig(routes: Routes, parentPath = ''): string[] {
    let paths: string[] = [];

    routes.forEach(route => {
      // Skip empty paths that aren't at the root level
      if (!route.path && parentPath) return;

      const routePath = route.path || '';
      const fullPath = parentPath
        ? `${parentPath}/${routePath}`.replace(/\/+/g, '/')
        : routePath;

      if (fullPath) {
        paths.push(fullPath);
      }

      if (route.children) {
        paths = paths.concat(
          this.extractRoutePathsFromConfig(route.children, fullPath)
        );
      }
    });

    return paths.filter(path => path); // Filter out any remaining empty paths
  }

  handleAccessDenied(): void {
    // Cerrar sesión
    this.authService.logout();

    // Redirigir a spad.com.co
    window.location.href = 'https://spad.com.co/';
  }
}
