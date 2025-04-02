import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

import { UserRoleModel } from '@domain/models/user-role.model';
import { UserRoleInterface } from '@domain/interfaces';
import { AuthRepository } from '@infrastructure/repositories';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UserRoleRepository {
  private readonly API_URL = environment.apiUrls.userRoles;

  private readonly httpClient = inject(HttpClient);
  private readonly authRepository = inject(AuthRepository);

  getUserRoles(email: string): Observable<UserRoleModel> {
    const idToken = this.authRepository.accessToken;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.get<UserRoleInterface>(`${this.API_URL}/${email}`, { headers, observe: 'response' }).pipe(
      map(response => {
        // console.log('👨🏻‍🦰 User Roles Response:', response);

        if (!response.body) {
          throw new Error('Response body is null');
        }

        return new UserRoleModel(
          response.body.hasAccess,
          response.body.roles,
          response.body.accessRoutes,
          response.body.lastConnection,
          response.body.error,
          response.body.message,
        );
      }),
      catchError(error => {
        // console.error('👨🏻‍🦰 User Roles Error:', error);

        throw error;
      }),
    );
  }
}
