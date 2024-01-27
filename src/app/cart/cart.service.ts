import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Product } from '../products/product';
import { CartItem } from './cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = []; // Current value of cartItems

  // Manage state with subjects
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]); // Subject);
  cartItems$ = this.cartItemsSubject.asObservable();

  // Number of items in the cart
  cartCount$ = this.cartItems$.pipe(
    map((cartItems) =>
      cartItems.reduce((accQty, item) => accQty + item.quantity, 0)
    )
  );

  // Total up the extended price for each item
  subTotal$ = this.cartItems$.pipe(
    map((cartItems) =>
      cartItems.reduce(
        (accTotal, item) => accTotal + item.quantity * item.product.price,
        0
      )
    )
  );

  // Delivery is free if spending more than $50
  deliveryFee$ = this.subTotal$.pipe(
    map((subTotal) => (subTotal < 50 ? 5.99 : 0))
  );

  // Tax could be based on shipping address zip code
  tax$ = this.subTotal$.pipe(
    map((subTotal) => Math.round(subTotal * 10.75) / 100)
  );

  // Total price
  totalPrice$ = combineLatest([
    this.subTotal$,
    this.deliveryFee$,
    this.tax$,
  ]).pipe(
    map(([subTotal, deliveryFees, tax]) => subTotal + deliveryFees + tax)
  );

  // Add the vehicle to the cart
  // If the item is already in the cart, increase the quantity
  addToCart(product: Product): void {
    console.log(this.cartItems);
    const index = this.cartItems.findIndex(
      (item) => item.product.id === product.id
    );
    if (index === -1) {
      // Not already in the cart, so add with default quantity of 1
      this.cartItems.push({ product, quantity: 1 });
    } else {
      // Already in the cart, so increase the quantity by 1
      this.cartItems[index].quantity++;
    }
    // Emit updated value to subscribers
    this.cartItemsSubject.next([...this.cartItems]);
  }

  // Remove the item from the cart
  removeFromCart(cartItem: CartItem): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.product.id !== cartItem.product.id
    );
    // Emit updated value to subscribers
    this.cartItemsSubject.next([...this.cartItems]);
  }

  // Update the cart quantity
  updateQuantity(cartItem: CartItem, quantity: number): void {
    const index = this.cartItems.findIndex(
      (item) => item.product.id === cartItem.product.id
    );
    if (index !== -1) {
      this.cartItems[index].quantity = quantity;
      // Emit updated value to subscribers
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }
}
