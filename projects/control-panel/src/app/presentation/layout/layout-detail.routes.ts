import { Routes } from '@angular/router';

import { RouteAccessGuard } from '@application/guards';
import { RunLogComponent, ServiceHistoryComponent } from '@presentation/pages';

export const LayoutDetailRoutes: Routes = [
  {
    path: 'service-history',
    component: ServiceHistoryComponent,
    title: 'Historial de Servicios',
    canActivate: [RouteAccessGuard],
  },
  {
    path: 'run-log/:id',
    component: RunLogComponent,
    title: 'Run Log',
    canActivate: [RouteAccessGuard],
  },
];
