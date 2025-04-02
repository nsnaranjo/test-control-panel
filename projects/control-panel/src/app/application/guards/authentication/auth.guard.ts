import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { InitiateAuthFlowUseCase } from '@application/usecases';
import { AuthRepository } from '@infrastructure/repositories';
import { AuthorizationService, AuthService } from '@infrastructure/services';
import { routes } from '@presentation/app.routes';
import { LoadingService } from '@presentation/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private readonly router = inject(Router);

  private readonly initiateAuthFlowUseCase = inject(InitiateAuthFlowUseCase);
  private readonly authRepository = inject(AuthRepository);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // console.log('AuthGuard: Iniciando canActivate, URL:', state.url);

    // Activa el spinner manualmente (además de lo gestionado en AppComponent)
    this.loadingService.show();

    try {
      // Si estamos en la ruta de carga, permitir acceso
      if (state.url === '/loading') {
        //console.log('AuthGuard: En pantalla de carga');
        return true;
      }

      const isAuthenticated = this.authService.checkAuthState();

      // Si no hay autenticación, iniciar flujo de autenticación
      if (!isAuthenticated) {
        //console.log('AuthGuard: No hay autenticación, iniciando flujo');
        const authResult = await this.initiateAuthFlowUseCase.execute();
        if (authResult) {
          // Si la autenticación fue exitosa, redirigir a loading
          await this.router.navigateByUrl('/loading');
          return false;
        }
        return false;
      }

      const logoutTime = sessionStorage.getItem('auth_logout_time');

      if (logoutTime) {
        const timeSinceLogout = Date.now() - parseInt(logoutTime, 10);
        // Si el logout fue hace menos de 5 minutos, reiniciar autenticación
        if (timeSinceLogout < 300000) {
          sessionStorage.removeItem('auth_logout_time');
          const authResult = await this.initiateAuthFlowUseCase.execute();
          if (authResult) {
            await this.router.navigateByUrl('/loading');
            return false;
          }
          return false;
        }
      }
      // Si estamos en la raíz, redirigir a loading
      if (state.url === '' || state.url === '/') {
        //console.log('AuthGuard: Redirigiendo a loading desde:', state.url);
        await this.router.navigateByUrl('/loading');
        return false;
      }

      // Para cualquier otra ruta protegida, verificar autorización
      //console.log('AuthGuard: Verificando autorización para ruta:', state.url);
      return await this.authorizationService.checkUserAuthorization(routes);
    } finally {
      // Desactivar el spinner una vez finalizado el proceso
      this.loadingService.hide();
    }
  }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivate(route, state);
};
