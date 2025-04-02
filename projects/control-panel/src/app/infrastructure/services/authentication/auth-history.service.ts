import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@infrastructure/services';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthHistoryService {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private lastKnownAuthState = false;
  private navigationStack: string[] = [];

  initialize(): void {
    // Suscribirse a los eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.navigationStack.push(event.urlAfterRedirects);
      // Mantener solo los últimos 10 urls para no usar demasiada memoria
      if (this.navigationStack.length > 10) {
        this.navigationStack.shift();
      }
    });

    // Suscribirse a cambios en el estado de autenticación
    this.authService.authState$.subscribe(isAuthenticated => {
      // Si cambia el estado de autenticación de true a false
      if (this.lastKnownAuthState && !isAuthenticated) {
        this.clearNavigationStack();
      }
      this.lastKnownAuthState = isAuthenticated;
    });

    // Interceptar los eventos de popstate (botón atrás)
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  private handlePopState(event: PopStateEvent): void {
    // Si hay estado y muestra que se cerró sesión
    if (event?.state?.authLoggedOut) {
      // Prevenir la navegación hacia atrás
      history.forward();
      // Forzar inicio de autenticación
      this.authService.initiateAuthFlow();
      return;
    }

    // Verificar si hay una sesión válida
    if (!this.authService.checkAuthState()) {
      // Si no hay sesión válida y estamos navegando hacia atrás
      event.preventDefault();
      history.forward();
      // Iniciar flujo de autenticación
      this.authService.initiateAuthFlow();
    }
  }

  private clearNavigationStack(): void {
    this.navigationStack = [];
  }
}
