import { Routes } from '@angular/router';

import { RouteAccessGuard } from '@application/guards';
import { HomeComponent, ProjectsComponent } from '@presentation/pages';

export const LayoutGeneralRoutes: Routes = [
  {
    path: 'instances',
    component: HomeComponent,
    canActivate: [RouteAccessGuard],
  },
  {
    path: 'projects-panel',
    component: ProjectsComponent,
    canActivate: [RouteAccessGuard],
  },
];
