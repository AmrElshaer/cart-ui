import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  filter,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Product, Result } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  selectedProduct = signal<number | undefined>(undefined);

  private products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    map((p) => ({ data: p } as Result<Product[]>)),
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError((err) =>
      of({
        data: [],
        error: this.errorService.formatError(err),
      } as Result<Product[]>)
    )
  );
  private productsResult = toSignal(this.products$, {
    initialValue: { data: [] } as Result<Product[]>,
  });
  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);
  // filter(Boolean) if value is null or undefined or false no need to evaluate
  private productResult1$ = toObservable(this.selectedProduct).pipe(
    filter(Boolean),
    switchMap((id) => {
      const productUrl = this.productsUrl + '/' + id;
      return this.http.get<Product>(productUrl).pipe(
        switchMap((product) => this.getProductWithReviews(product)),
        catchError((err) =>
          of({
            data: undefined,
            error: this.errorService.formatError(err),
          } as Result<Product>)
        )
      );
    }),
    map((p) => ({ data: p } as Result<Product>))
  );
  // Find the product in the existing array of products

  private foundProduct = computed(() => {
    // Dependent signals
    const p = this.products();
    const id = this.selectedProduct();
    if (p && id) {
      return p.find((product) => product.id === id);
    }
    return undefined;
  });

  product$ = toObservable(this.foundProduct).pipe(
    filter(Boolean),
    switchMap((product) => this.getProductWithReviews(product)),
    catchError((err) => this.handleError(err))
  );

  productSelected(selectedProductId: number): void {
    this.selectedProduct.set(selectedProductId);
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews } as Product)));
    } else {
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
    // throw formattedMessage;
  }
}
