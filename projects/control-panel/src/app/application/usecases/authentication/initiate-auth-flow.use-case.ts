import { inject, Injectable } from '@angular/core';

import { AuthService } from '@infrastructure/services';

@Injectable({
  providedIn: 'root',
})
export class InitiateAuthFlowUseCase {
  private readonly authService = inject(AuthService);

  async execute(): Promise<boolean> {
    return this.authService.initiateAuthFlow();
  }
}
