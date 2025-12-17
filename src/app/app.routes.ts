import { Routes } from '@angular/router';
import { UnsavedChangesGuard } from './core/guards/unsaved-changes.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products').then(m => m.ProductsComponent)
  },
  {
    path: 'form-reactivo',
    loadComponent: () => import('./features/form-reactivo/form-reactivo').then(m => m.FormReactivoComponent),
    canDeactivate: [UnsavedChangesGuard]
  }
];

export const routes: Routes = appRoutes;
