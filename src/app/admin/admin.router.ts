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
    path: 'platform',
    loadComponent: () => import('./shared/components/admin-toolbar/admin-toolbar.component').then(c => c.AdminToolbarComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/platform/dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./views/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
      }, {
        path: 'catalog/benefit',
        loadComponent: () => import('./views/catalogs/admin-catalog-benefits/admin-catalog-benefits.component').then(c => c.AdminCatalogBenefitsComponent)
      }, {
        path: 'role',
        loadComponent: () => import('./views/admin-role/admin-role.component').then(c => c.AdminRoleComponent),
      }, {
        path: 'excel',
        loadComponent: () => import('./views/admin-excel/admin-excel.component').then(c => c.AdminExcelComponent),
      }
    ]
  }
]
