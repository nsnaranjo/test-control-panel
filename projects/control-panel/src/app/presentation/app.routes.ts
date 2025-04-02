import { Routes } from '@angular/router';


import { LayoutGeneralRoutes } from './layout/layout-general.routes';
import { LayoutDetailRoutes } from './layout/layout-detail.routes';

import { LayoutComponent } from './layout/layout-general/layout.component';
import { LayoutDetailComponent } from './layout/layout-detail/layout-detail.component';
import { AuthGuard } from '@application/guards';
import { LoadingComponent } from '@components/ui/loading-component/loading.component';


export const routes: Routes = [
  {
    path: 'loading',
    component: LoadingComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: LayoutGeneralRoutes,
  },
  {
    path: '',
    component: LayoutDetailComponent,
    canActivate: [AuthGuard],
    children: LayoutDetailRoutes,
  },
];
