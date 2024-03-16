import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { filter, map, of, switchMap } from 'rxjs';
import { NumberValidators } from 'src/app/utilities/number.validator';
import { ProductService } from '../product.service';
import { CreateProductRequest } from './product-create-request';
import { ProductFormControl } from './product-form-control';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCreateComponent {
  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  productFormControl = ProductFormControl;
  errorMessage?: string;
  get tags(): FormArray {
    return this.productForm.get(ProductFormControl.Tags) as FormArray;
  }
  productForm = this._fb.group({
    [this.productFormControl.ProductName]: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    [this.productFormControl.ProductCode]: ['', Validators.required],
    [this.productFormControl.StarRating]: ['', NumberValidators.range(1, 5)],
    [this.productFormControl.Tags]: this._fb.array([]),
    [this.productFormControl.Description]: '',
  });
  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }
  saveProduct(): void {
    of(this.productForm)
      .pipe(
        filter((f) => f.valid && f.dirty),
        map((f) => {
          const formValue = f.value;
          return this.mapFormValueToCreateProductRequest(formValue);
        }),

        switchMap((r) => this._productService.createProduct(r)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe({
        next: (p) => this.onSaveComplete(),
        error: (err) => (this.errorMessage = err),
      });
  }

  private mapFormValueToCreateProductRequest(
    formValue: Partial<{
      productName: string | null;
      productCode: string | null;
      starRating: string | null;
      tags: unknown[];
      description: string | null;
    }>
  ): CreateProductRequest {
    return new CreateProductRequest(
      formValue.productName ?? '',
      formValue.productCode ?? '',
      formValue.tags
        ? (formValue.tags.filter((tag) => typeof tag === 'string') as string[])
        : [],
      formValue.description ?? ''
    );
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.productForm.reset();
    this._router.navigate(['/products']);
  }
}
