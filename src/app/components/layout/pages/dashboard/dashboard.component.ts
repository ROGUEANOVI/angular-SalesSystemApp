import { Component, OnInit } from '@angular/core';

import { Chart , registerables } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  incomesTotal: string = "0";
  salesTotal: string = "0";
  productsTotal: string = "0";

  constructor(
    private _dashboardService: DashboardService,
  ){}


  showGraph(labelGraph: any, dataGraph: any[]){
    const chartBars = new Chart("chartBars", {
      type: "bar",
      data: {
        labels: labelGraph,
        datasets:[{
          label: "# de ventas",
          data: dataGraph,
          backgroundColor: ["rgb(54, 162, 235, 0.2)"],
          borderColor: ["rgb(54, 162, 235, 1)"],
          borderWidth: 1
        }] 
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales:{
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashboardService.resume().subscribe({
      next: (data) => {
        if (data.status) {
          this.incomesTotal = data.value.incomesTotal;
          this.salesTotal = data.value.salesTotal;
          this.productsTotal = data.value.productsTotal;

          const arrayData: any[] = data.value.lastWeekSales;
          console.log(arrayData);

          const labelTemp = arrayData.map((value) => {
            return value.date
          });
          const dataTemp = arrayData.map((value) => {
             return value.total
          });

          this.showGraph(labelTemp, dataTemp);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}

