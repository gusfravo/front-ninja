import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin'
  }, {
    path: 'admin',
    loadChildren: () => import('./admin/admin.router').then(r => r.adminRouter)
  }, {
    path: 'capturer',
    loadChildren: () => import('./capturer/capturer.router').then(r => r.capturerRouter)
  }
];
