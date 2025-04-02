import { inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

import { UserProfileModel } from '@domain/models';
import { UserProfileInterface } from '@domain/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private readonly oAuthService = inject(OAuthService);

  getUserProfile(): UserProfileInterface | null {
    const claims = this.oAuthService.getIdentityClaims();

    if (claims) {
      return new UserProfileModel(
        claims['picture'],
        claims['given_name'],
        claims['family_name'],
        claims['iat'],
        claims['email'],
      );
    }

    return null;
  }

  isAuthenticated(): boolean {
    const token = this.oAuthService.getAccessToken();

    return !!token;
  }

  get accessToken(): string | null {
    return this.oAuthService.getIdToken();
  }
}
