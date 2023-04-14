import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Sale } from 'src/app/interfaces/sale';
import { SaleService } from 'src/app/services/sale.service';
import { UtilityService } from 'src/app/reusable/utility.service';
import { SaleDetailModalComponent } from '../../modals/sale-detail-modal/sale-detail-modal.component';

export const MY_DATA_FORMATS = {
  parse:{
    dateInput: "DD/MM/YYYY"
  },
  display:{
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-sale-history',
  templateUrl: './sale-history.component.html',
  styleUrls: ['./sale-history.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class SaleHistoryComponent implements OnInit, AfterViewInit  {
  
  searchForm: FormGroup;
  
  searchOptions: any[] = [
    {value:"date", description: "Fecha"},
    {value:"number", description: "Numero de Orden"}
  ];

  columnsTable: string[] = ["registrationDate", "saleTicketNumber", "paymentType", "total", "action"];
  initialData: Sale[] = [];
  salesListDataTable = new MatTableDataSource(this.initialData);
  @ViewChild(MatPaginator) paginatorTable!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog,
    private _saleService: SaleService,
    private _utilityService: UtilityService
    ){

    this.searchForm = fb.group({
      searchBy: ["date"],
      saleNumber: [""],
      initialDate: [""],
      lastDate: [""]
    });

    this.searchForm.get("searchBy")?.valueChanges.subscribe(value => {
      this.searchForm.patchValue({
        saleNumber: "",
        initialDate: "",
        lastDate: ""
      })
    });
  }

  getSales(){
    this._saleService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          this.salesListDataTable.data = data.value;
        }
        else{
          this._utilityService.showAlert("No se encontraron datos","Opss");
        }
      },
      error: (err) => {
        console.log(err); 
      }
    });
  }


  ngOnInit(): void {
    this.getSales();
  }

  ngAfterViewInit(): void {
    this.salesListDataTable.paginator = this.paginatorTable;
  }

  filterTable(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.salesListDataTable.filter = filterValue.trim().toLocaleLowerCase();
  }

  

  searchSales(){
    let initialDate: string = "";
    let lastDate: string = "";

    if (this.searchForm.value.searchBy === "all") {
      this.getSales();
      return;
    }

    if (this.searchForm.value.searchBy === "date") {
      initialDate = moment(this.searchForm.value.initialDate).format("DD/MM/YYYY");
      lastDate = moment(this.searchForm.value.lastDate).format("DD/MM/YYYY");

      if(initialDate === "Invalid date" || lastDate === "Invalid date"){
        this._utilityService.showAlert("Debe ingresar ambas fechas", "Opss");
        return;
      }
    }

    this._saleService.history(
      this.searchForm.value.searchBy, 
      this.searchForm.value.saleNumber, 
      initialDate, 
      lastDate
    ).subscribe({
      next: (data) => {
        if (data.status) {
          this.salesListDataTable.data = data.value;
        }
        else{
          this._utilityService.showAlert("No se encontraron datos","Opss");
        }
      },
      error: (err) => {
        console.log(err); 
      }
    });
  }

  showSaleDetail(sale: Sale){
    this._dialog.open(SaleDetailModalComponent, {
      data: sale,
      disableClose: true,
      width: "700px"
    });
  }

}
