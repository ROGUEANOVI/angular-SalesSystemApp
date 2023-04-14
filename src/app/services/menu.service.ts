import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlApi: string = `${environment.URI}Menu/`;

  constructor(private readonly http: HttpClient) { }

  getList(userId: number): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}List?userId=${userId}`);
  }
}
