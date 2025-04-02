import { inject, Injectable } from '@angular/core';

import { AuthService } from '@infrastructure/services';

@Injectable({
  providedIn: 'root',
})
export class LogoutUseCase {
  private readonly authService = inject(AuthService);

  execute(): void {
    this.authService.logout();
  }
}
