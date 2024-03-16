import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './utilities/page-not-found.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';

export const routes: Routes = [
  { path: 'welcome', component: HomeComponent },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-list/product-list.component').then(
        (c) => c.ProductListComponent
      ),
  },
  {
    path: 'products/create',
    component: ProductCreateComponent,
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart-shell/cart-shell.component').then(
        (c) => c.CartShellComponent
      ),
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
