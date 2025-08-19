import { Routes } from "@angular/router";

export const adminRouter: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }, {
    path: 'login',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent)
  }
]
