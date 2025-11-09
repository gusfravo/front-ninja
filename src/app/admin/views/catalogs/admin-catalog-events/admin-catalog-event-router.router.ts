import { Routes } from "@angular/router";

export const adminCatalogEventRouter: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-catalog-events.component').then(c => c.AdminCatalogEventsComponent)
  }, {
    path: 'update/:uuid',
    loadComponent: () => import('./components/admin-catalog-events-update/admin-catalog-events-update.component').then(c => c.AdminCatalogEventsUpdateComponent)
  }, {
    path: 'config/:uuid',
    loadComponent: () => import('./components/admin-catalog-events-config/admin-catalog-events-config.component').then(c => c.AdminCatalogEventsConfigComponent)
  }
];
