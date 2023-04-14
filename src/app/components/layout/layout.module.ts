import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { ProductComponent } from './pages/product/product.component';
import { SaleComponent } from './pages/sale/sale.component';
import { SaleHistoryComponent } from './pages/sale-history/sale-history.component';
import { ReportComponent } from './pages/report/report.component';

import { SharedModule } from 'src/app/reusable/shared/shared.module';
import { UserModalComponent } from './modals/user-modal/user-modal.component';
import { ProductModalComponent } from './modals/product-modal/product-modal.component';
import { SaleDetailModalComponent } from './modals/sale-detail-modal/sale-detail-modal.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    ProductComponent,
    SaleComponent,
    SaleHistoryComponent,
    ReportComponent,
    UserModalComponent,
    ProductModalComponent,
    SaleDetailModalComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
