import { Routes } from "@angular/router";

export const adminCatalogEventRouter: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-catalog-events.component').then(c => c.AdminCatalogEventsComponent)
  }
];
