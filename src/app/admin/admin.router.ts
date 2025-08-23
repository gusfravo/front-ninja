import { Routes } from "@angular/router";

export const adminRouter: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }, {
    path: 'login',
    loadComponent: () => import('./views/admin-login/admin-login.component').then(c => c.AdminLoginComponent)
  }, {
    path: 'dashboard',
    loadComponent: () => import('./views/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent)
  }, {
    path: 'role',
    loadComponent: () => import('./views/admin-role/admin-role.component').then(c => c.AdminRoleComponent)
  }, {
    path: 'excel',
    loadComponent: () => import('./views/admin-excel/admin-excel.component').then(c => c.AdminExcelComponent)
  }
]
