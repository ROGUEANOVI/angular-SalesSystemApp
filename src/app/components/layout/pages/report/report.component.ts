import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Report } from 'src/app/interfaces/report';
import { SaleService } from 'src/app/services/sale.service';
import { UtilityService } from 'src/app/reusable/utility.service';


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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class ReportComponent {

  filterForm: FormGroup;
  saleReportList: Report[] = [];
  columnsTable: string[] = ["registrationDate", "ticketNumber", "paymentType", "saleTotal", "product", "amount", "price", "total"];
  saleReportData = new MatTableDataSource(this.saleReportList);
  @ViewChild(MatPaginator) paginatorTable!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _saleService: SaleService,
    private _utilityService: UtilityService
  ){
    this.filterForm = fb.group({
      initialDate: ["", Validators.required],
      lastDate: ["", Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.saleReportData.paginator = this.paginatorTable;
  }

  searchSales(){
    const initialDate = moment(this.filterForm.value.initialDate).format("DD/MM/YYYY");
    const lastDate = moment(this.filterForm.value.lastDate).format("DD/MM/YYYY");
    
    if(initialDate === "Invalid date" || lastDate === "Invalid date"){
      this._utilityService.showAlert("Debe ingresar ambas fechas", "Opss");
      return;
    }

    this._saleService.report(
      initialDate, 
      lastDate
    ).subscribe({
      next: (data) => {
        if (data.status) {
          this.saleReportList = data.value;
          this.saleReportData.data = data.value;
        }
        else{
          this.saleReportList =[];
          this.saleReportData.data = [];
          this._utilityService.showAlert("No se encontraron datos","Opss");
        }
      },
      error: (err) => {
        console.log(err); 
      }
    });
  }

  exportExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.saleReportList);

    XLSX.utils.book_append_sheet(wb, ws, "Reprote");
    XLSX.writeFile(wb, "reporte_ventas.xlsx");
  }
}
