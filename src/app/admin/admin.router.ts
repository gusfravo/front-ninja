import { Routes } from "@angular/router";

export const adminRouter: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }, {
    path: 'login',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent)
  }, {
    path: 'dashboard',
    loadComponent: () => import('./views/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent)
  }, {
    path: 'role',
    loadComponent: () => import('./views/admin-role/admin-role.component').then(c => c.AdminRoleComponent)
  }
]
