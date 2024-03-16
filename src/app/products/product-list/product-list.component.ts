import { Component, inject } from '@angular/core';

import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgClass, ProductDetailComponent],
})
export class ProductListComponent {
  pageTitle = 'Products';

  private productService = inject(ProductService);
  products$ = this.productService.products$;
  errorMessage = this.productService.productsError;

  products = this.productService.products;
  productsWithSignal = toSignal(this.productService.products$);
  selectedProductId = this.productService.selectedProduct;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}
