import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';
import { Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private urlApi: string = `${environment.URI}Sale/`;

  constructor(private readonly http: HttpClient) { }

  getList(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}List/`);
  }
  
  register(request: Sale): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Register/`, request);
  }

  history(searchBy:string, saleNumber: string, initialDate:string, lastDate: string): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}History?searchBy=${searchBy}&saleNumber=${saleNumber}&initialDate=${initialDate}&lastDate=${lastDate}`);
  }

  report( initialDate:string, lastDate: string): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Report?initialDate=${initialDate}&lastDate=${lastDate}`);
  }
}
