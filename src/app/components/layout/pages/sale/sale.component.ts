import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/interfaces/product';
import { Sale } from 'src/app/interfaces/sale';
import { SaleDetail } from 'src/app/interfaces/sale-detail';
import { UtilityService } from 'src/app/reusable/utility.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  productsList: Product[] = [];
  filterProductList: Product[] = [];

  productListSales: SaleDetail[] = [];
  disableButtonRegister: boolean = false;

  selectedProduct!: Product;
  defaultPymentType: string = "Efectivo"; 
  totalPay: number = 0;

  productSaleForm: FormGroup;
  columnsTable: string[] = ["product", "productsAmount", "price", "total", "action"];
  saleDetailDate = new MatTableDataSource(this.productListSales);

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private _saleService: SaleService,
    private _utilityService: UtilityService
  ){
    
    this.productSaleForm = this.fb.group({
      product: ["", Validators.required],
      amount: ["", Validators.required],
    });

    this._productService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          const list =  data.value as Product[];
          this.productsList = list.filter(p => p.isActive == 1 && p.stock > 0);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.productSaleForm.get("product")?.valueChanges.subscribe(value => {
      this.filterProductList = this.returnProductBySearch(value);
    });
  }

  ngOnInit(): void {
  }

  returnProductBySearch(search: any): Product[]{
    const searchValue = (typeof(search) === "string") ? search.toLocaleLowerCase() : search.name.toLocaleLowerCase();
    
    const productsFilter = this.productsList.filter(item => item.name.toLocaleLowerCase().includes(searchValue));

    return productsFilter;
  } 

  showProduct(product: Product): string{
    return product.name;
  }

  selectproductForSale(event: any){
    this.selectedProduct = event.option.value;
  }

  addProductForSale(){
    const amount: number = this.productSaleForm.value.amount; 
    const price: number = parseFloat(this.selectedProduct.price);
    const total: number = amount * price;
    this.totalPay = this.totalPay + total;

    this.productListSales.push({
      productId: this.selectedProduct.productId,
      productDescription: this.selectedProduct.name,
      amount: amount,
      price: String(price.toFixed(2)),
      total: String(total.toFixed(2)),
    });

    this.saleDetailDate = new MatTableDataSource(this.productListSales);

    this.productSaleForm.patchValue({
      product: "",
      amount: ""
    });
  }

  deleteProductForSale(detail: SaleDetail){
    this.totalPay = this.totalPay - parseFloat(detail.total);
    this.productListSales = this.productListSales.filter(p => p.productId != detail.productId);
    
    this.saleDetailDate = new MatTableDataSource(this.productListSales);
  }

  registerSale(){
    if(this.productListSales.length > 0){
      
      this.disableButtonRegister = true;
      
      const request: Sale = {
        paymentType: this.defaultPymentType,
        total: String(this.totalPay.toFixed(2)),
        saleDetails: this.productListSales
      }

      this._saleService.register(request).subscribe({
        next: (data) => {

          if(data.status) {
            this.totalPay = 0.00;
            this.productListSales = [];
            this.saleDetailDate = new MatTableDataSource(this.productListSales);
            
            Swal.fire({
              title: "¡Venta Realizada!",
              icon: "success",
              text: `Numero de Venta: ${data.value.saleTicketNumber}`
            });
          }
          else{
            console.log("Message",data.message);
            console.log("Status",data.status  );
            
            this._utilityService.showAlert("¡NO se pudo realizar la venta!", "¡Opss!");
          }
        },
        complete: () => {
          this.disableButtonRegister = false;
        }
        ,
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
