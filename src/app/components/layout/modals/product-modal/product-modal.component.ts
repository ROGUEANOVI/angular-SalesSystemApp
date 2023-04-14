import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { UtilityService } from 'src/app/reusable/utility.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit{
  productForm: FormGroup ;
  hiddenPasword: boolean = true;
  actionTitle: string = "Agregar";
  actionButton: string = "Guardar";
  categoriesList: Category[] = [];

  constructor(
    private actualModal: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public productData: Product,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _utilityService: UtilityService  
  ){
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      categoryId: ["1", Validators.required],
      stock: ["", Validators.required],
      price: ["", Validators.required],
      isActive: ["", Validators.required]
    });

    if (this.productData != null) {
      this.actionTitle = "Editar";
      this.actionButton = "Actualizar";
    }

    this._categoryService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          this.categoriesList = data.value;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    if (this.productData != null) {
      this.productForm.patchValue({
        name: this.productData.name,
        categoryId: this.productData.categoryId,
        stock: this.productData.stock,
        price: this.productData.price,
        isActive: this.productData.isActive.toString()
      });
    }
  }

  handleProduct(){
    const product: Product = {
      productId: this.productData == null ? 0 : this.productData.productId,
      name: this.productForm.value.name,
      stock: this.productForm.value.stock,
      price: this.productForm.value.price,
      isActive: parseInt(this.productForm.value.isActive),
      categoryId: this.productForm.value.categoryId,
      categoryDescription: ""
    }

    if (this.productData == null) {
      this._productService.add(product).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert("¡El producto ha sido agregado!", "¡Exitosamente!");
            this.actualModal.close("true");
          }
          else{
            this._utilityService.showAlert("¡NO se pudo agregar el producto!", "¡Error!");
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
    else{
      this._productService.edit(product).subscribe({
        next: (data) => {
          console.log(data);
          
          if (data.status) {
            this._utilityService.showAlert("¡El producto ha sido editado!", "¡Exitosamente!");
            this.actualModal.close("true");
          }
          else{
            this._utilityService.showAlert("¡NO se pudo editar el producto!", "¡Error!");
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  } 

}
