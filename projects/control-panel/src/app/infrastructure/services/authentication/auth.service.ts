import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oAuthService: OAuthService = inject(OAuthService);
  private readonly router = inject(Router);
  private authInProgress = false;

  private readonly authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.initAuth();

    window.addEventListener('storage', (event) => {
      // Si se modificó el almacenamiento, verificar autenticación
      if (event.key && (event.key.includes('token') || event.key.includes('oauth'))) {
        this.checkAuthState();
      }
    });
  }

  private initAuth() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.authGoogle.client_id,
      redirectUri: window.location.origin,
      scope: 'openid profile email',
      showDebugInformation: true,
      oidc: true,
      sessionChecksEnabled: true,
      customQueryParams: { prompt: 'select_account' },
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    // Verificar estado inicial
    this.checkAuthState();

    // Suscribirse a cambios en el token
    this.oAuthService.events.subscribe(event => {
      if (event.type === 'token_received' || event.type === 'token_expires' || event.type === 'logout') {
        this.checkAuthState();
      }
    });
  }

  // Método para verificar estado de autenticación
  checkAuthState(): boolean {
    const isAuthenticated = this.oAuthService.hasValidAccessToken();
    this.authStateSubject.next(isAuthenticated);
    return isAuthenticated;
  }

  async initiateAuthFlow(): Promise<boolean> {
    if (this.authInProgress) return false;

    this.authInProgress = true;

    try {
      await this.oAuthService.loadDiscoveryDocumentAndTryLogin();

      if (!this.oAuthService.hasValidAccessToken()) {
        // Si no hay token válido, iniciar el flujo de autenticación
        this.oAuthService.initImplicitFlow();
        return false;
      }

      // Si tenemos un token válido, actualizar el estado
      this.authStateSubject.next(true);
      return true;
    } catch (error) {
      console.error('Error en el flujo de autenticación:', error);
      // En caso de error, limpiar el estado
      this.oAuthService.logOut(true);
      sessionStorage.clear();
      localStorage.clear();
      return false;
    } finally {
      this.authInProgress = false;
    }
  }

  logout() {
    this.invalidateHistory();

    this.oAuthService.revokeTokenAndLogout(true)
      .then(() => this.finalizeLogout())
      .catch(() => this.finalizeLogout());
  }

  private finalizeLogout() {
    this.oAuthService.logOut(true);

    // Limpiar el almacenamiento
    sessionStorage.clear();
    localStorage.clear();

    // Establecer una marca de tiempo para el cierre de sesión
    sessionStorage.setItem('auth_logout_time', Date.now().toString());
    
    // Establecer un estado en el historial para prevenir navegación hacia atrás
    try {
      history.replaceState(
        { authLoggedOut: true, timestamp: Date.now() },
        document.title,
        window.location.href
      );
    } catch (e) {
      console.error('Error al modificar historial:', e);
    }

    // Redirigir a la página principal
    window.location.href = 'https://spad.com.co/';
  }

  private invalidateHistory() {
    // Establecer una marca en sessionStorage
    sessionStorage.setItem('auth_logout_time', Date.now().toString());

    // Intentar reemplazar el estado actual del historial con uno nuevo
    try {
      history.replaceState(
        { authLoggedOut: true, timestamp: Date.now() },
        document.title,
        window.location.href
      );
    } catch (e) {
      console.error('Error al modificar historial:', e);
    }
  }
}
