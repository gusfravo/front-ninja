import { Routes } from "@angular/router";
import { AuthGuard } from "@core/auth/guard/auth.guard";

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
    loadComponent: () => import('./views/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [AuthGuard],
  }, {
    path: 'role',
    loadComponent: () => import('./views/admin-role/admin-role.component').then(c => c.AdminRoleComponent),
    canActivate: [AuthGuard],
  }, {
    path: 'excel',
    loadComponent: () => import('./views/admin-excel/admin-excel.component').then(c => c.AdminExcelComponent),
    canActivate: [AuthGuard],
  }
]
