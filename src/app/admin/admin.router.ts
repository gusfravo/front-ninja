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
        path: 'catalog/benefit/update/:uuid',
        loadComponent: () => import('./views/catalogs/admin-catalog-benefits/admin-catalog-benefits-update/admin-catalog-benefits-update.component').then(c => c.AdminCatalogBenefitsUpdateComponent)
      }, {
        path: 'catalog/events',
        loadChildren: () => import('./views/catalogs/admin-catalog-events/admin-catalog-event-router.router').then(r => r.adminCatalogEventRouter)
      }, {
        path: 'catalog/member',
        loadComponent: () => import('./views/catalogs/admin-catalog-members/admin-catalog-members.component').then(c => c.AdminCatalogMembersComponent)
      }, {
        path: 'catalog/delegation',
        loadComponent: () => import('./views/catalogs/admin-catalog-delegations/admin-catalog-delegations.component').then(c => c.AdminCatalogDelegationsComponent)
      }, {
        path: 'catalog/delegation/update/:uuid',
        loadComponent: () => import('./views/catalogs/admin-catalog-delegations/components/admin-catalog-delegations-update/admin-catalog-delegations-update.component').then(c => c.AdminCatalogDelegationsUpdateComponent)
      }, {
        path: 'role',
        loadComponent: () => import('./views/admin-role/admin-role.component').then(c => c.AdminRoleComponent),
      }, {
        path: 'role/update/:uuid',
        loadComponent: () => import('./views/admin-role/components/admin-role-update/admin-role-update.component').then(c => c.AdminRoleUpdateComponent),
      }, {
        path: 'user',
        loadComponent: () => import('./views/admin-user/admin-user.component').then(c => c.AdminUserComponent),
      }, {
        path: 'user/update/:uuid',
        loadComponent: () => import('./views/admin-user/components/admin-user-update/admin-user-update.component').then(c => c.AdminUserUpdateComponent),
      }, {
        path: 'excel',
        loadComponent: () => import('./views/admin-excel/admin-excel.component').then(c => c.AdminExcelComponent),
      }
    ]
  }
]
