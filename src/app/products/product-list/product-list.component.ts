import { Component, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgClass, ProductDetailComponent],
})
export class ProductListComponent {
  pageTitle = 'Products';

  private productService = inject(ProductService);
  errorMessage = this.productService.productsError;

  products = this.productService.products;

  selectedProductId = this.productService.selectedProduct;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}
