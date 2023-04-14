import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/interfaces/product';
import { UtilityService } from 'src/app/reusable/utility.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductModalComponent } from '../../modals/product-modal/product-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {
  
  columnsTable: string[] = ["name", "categoryDescription", "stock", "price", "status", "action"];
  initialData: Product[] = [];
  productsDataTable = new MatTableDataSource(this.initialData);
  @ViewChild(MatPaginator) paginatorTable!: MatPaginator;

  constructor(
    private _dialog: MatDialog,
    private _productService: ProductService,
    private _utilityService: UtilityService
  ){}
  
  getProducts(){
    this._productService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          this.productsDataTable.data = data.value;
        }
        else{
          this._utilityService.showAlert("¡No se encontraron datos!", "¡Opss!");
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.productsDataTable.paginator = this.paginatorTable;
  }

  filterTable(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataTable.filter = filterValue.trim().toLocaleLowerCase();
    console.log(this.productsDataTable.filter);
    
  }

  addProduct(){
    this._dialog.open(ProductModalComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.getProducts();
      }
    });
  }

  editProduct(product: Product){
    this._dialog.open(ProductModalComponent, {
      disableClose: true,
      data: product
    }).afterClosed().subscribe(result => {
      if (result === "true") {
        this.getProducts();
      }
    });
  }

  deleteProduct(product: Product){
    Swal.fire({
      title: "¿Desea eliminar este producto?",
      text:  product.name,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then(result => {
      if (result.isConfirmed) {
        this._productService.delete(product.productId).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert("¡El producto ha sido eliminado!", "¡Exitosamente!");
              this.getProducts();
            }
            else{
              this._utilityService.showAlert("¡NO se pudo eliminar el producto!", "¡Error!");
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }
}
