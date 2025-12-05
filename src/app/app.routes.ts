import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AboutComponent } from './about/about';
import { ProductsComponent } from './products/products';
import { FormReactivoComponent } from './form-reactivo/form-reactivo';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'form-reactivo',
    component: FormReactivoComponent,
    canDeactivate: [UnsavedChangesGuard]
  }
];
