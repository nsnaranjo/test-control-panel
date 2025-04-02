import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { NgxEchartsModule } from 'ngx-echarts';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { routes } from '@presentation/app.routes';
import { AuthHistoryService } from '@infrastructure/services/authentication/auth-history.service';

function initializeHistoryService(historyService: AuthHistoryService) {
  return () => {
    historyService.initialize();
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Routes managed by Angular
    provideHttpClient(), // HTTP managed by Angular
    importProvidersFrom( // Echarts managed by Angular
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ),
    provideOAuthClient(), // OAuth managed by Angular
    {
      provide: APP_INITIALIZER,
      useFactory: initializeHistoryService,
      deps: [AuthHistoryService],
      multi: true
    }
  ],
};
