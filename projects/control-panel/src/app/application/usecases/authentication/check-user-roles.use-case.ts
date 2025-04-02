import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { UserRoleModel } from '@domain/models/user-role.model';
import { AuthRepository, UserRoleRepository } from '@infrastructure/repositories';

@Injectable({
  providedIn: 'root',
})
export class CheckUserRolesUseCase {
  private readonly userRoleRepository = inject(UserRoleRepository);
  private readonly authRepository = inject(AuthRepository);

  execute(): Observable<UserRoleModel> {
    const userProfile = this.authRepository.getUserProfile();

    //console.log('Perfil de usuario:', userProfile);

    if (!userProfile) {
      return throwError(() => new Error('No se encontró perfil de usuario'));
    }

    return this.userRoleRepository.getUserRoles(userProfile.email).pipe(
      tap(userRole => {
        // console.log('Roles de usuario recuperados:', userRole);
      }),
      catchError(error => {
        // console.error('Error al recuperar roles de usuario:', error);
        return throwError(() => error);
      }),
    );
  }
}
