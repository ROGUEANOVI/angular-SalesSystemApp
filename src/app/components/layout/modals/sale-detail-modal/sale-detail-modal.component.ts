import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sale } from 'src/app/interfaces/sale';
import { SaleDetail } from 'src/app/interfaces/sale-detail';


@Component({
  selector: 'app-sale-detail-modal',
  templateUrl: './sale-detail-modal.component.html',
  styleUrls: ['./sale-detail-modal.component.css']
})
export class SaleDetailModalComponent {
  
  registrationDate: string = "";
  saleTiketNumber: string = "";
  pymentType: string = "";
  total: string = "";
  saleDetail: SaleDetail[] = [];

  columnsTable: string[] = ["product", "amount", "price", "total"];

  constructor(
    @Inject(MAT_DIALOG_DATA) public _sale: Sale
  ){
    this.registrationDate = _sale.registrationDate!;
    this.saleTiketNumber = _sale.saleTicketNumber!;
    this.pymentType = _sale.paymentType;
    this.total = _sale.total;
    this.saleDetail = _sale.saleDetails;
  }
}
