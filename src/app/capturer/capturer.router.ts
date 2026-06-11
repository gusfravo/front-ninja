import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/guard/auth.guard';

export const capturerRouter: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }, {
    path: 'login',
    loadComponent: () => import('./views/capturer-login/capturer-login.component').then(c => c.CapturerLoginComponent)
  }, {
    path: 'platform',
    loadComponent: () => import('./shared/components/capturer-toolbar/capturer-toolbar.component').then(c => c.CapturerToolbarComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/capturer/platform/dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./views/capturer-dashboard/capturer-dashboard.component').then(c => c.CapturerDashboardComponent)
      }
    ]
  }
];
