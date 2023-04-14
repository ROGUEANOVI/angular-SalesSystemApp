import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlApi: string = `${environment.URI}Product/`;

  constructor(private readonly http: HttpClient) { }

  getList(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}List/`);
  }

  add(request: Product): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Add/`, request);
  }

  edit(request: Product): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Edit/`, request);
  }

  delete(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Delete/${id}`);
  }
}
