import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EMPTY, catchError, tap } from 'rxjs';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-list',
  standalone: true,
  imports: [CartItemComponent, NgFor, NgIf, AsyncPipe],
  templateUrl: 'cart-list.component.html',
})
export class CartListComponent {
  errorMessage = '';
  cartService = inject(CartService);
  cartItems$ = this.cartService.cartItems$.pipe(
    tap((items) => console.log(items)),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  pageTitle = 'Cart';
}
