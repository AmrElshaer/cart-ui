import { Component, inject } from '@angular/core';
import { CartService } from './cart/cart.service';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'pm-root',
  standalone: true,
  imports: [NgIf, RouterLinkActive, RouterLink, RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private cartService = inject(CartService);
  pageTitle = 'Binder';

  readonly cartCount$ = this.cartService.cartCount$;
}
