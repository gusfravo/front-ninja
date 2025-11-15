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
  }, {
    path: 'workshop',
    loadComponent: () => import('./components/admin-catalog-events-workshop/admin-catalog-events-workshop.component').then(c => c.AdminCatalogEventsWorkshopComponent)
  }, {
    path: 'workshop/process/:uuid',
    loadComponent: () => import('./components/admin-catalog-events-process/admin-catalog-events-process.component').then(c => c.AdminCatalogEventsProcessComponent)
  }, {
    path: 'workshop/process/file/created/:uuid',
    loadComponent: () => import('./components/admin-catalog-events-process-update/admin-catalog-events-process-update.component').then(c => c.AdminCatalogEventsProcessUpdateComponent)
  }
];
