import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent {
  @Input({ required: true }) cartItem!: CartItem;
  cartService = inject(CartService);

  qtyArr = [...Array(8).keys()].map((x) => x + 1);

  exPrice = this.cartItem?.quantity * this.cartItem?.product.price;

  onQuantitySelected(quantity: number): void {
    this.cartService.updateQuantity(this.cartItem, quantity);
  }

  removeFromCart(): void {
    this.cartService.removeFromCart(this.cartItem);
  }
}
