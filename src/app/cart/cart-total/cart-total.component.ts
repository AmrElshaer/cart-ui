import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe, AsyncPipe],
})
export class CartTotalComponent {
  cartService = inject(CartService);
  cartCount$ = this.cartService.cartCount$;
  subTotal$ = this.cartService.subTotal$;
  deliveryFee$ = this.cartService.deliveryFee$;
  tax$ = this.cartService.tax$;
  totalPrice$ = this.cartService.totalPrice$;
}
