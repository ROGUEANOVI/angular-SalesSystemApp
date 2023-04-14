import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private urlApi: string = `${environment.URI}Dashboard/`;

  constructor(private readonly http: HttpClient) { }

  resume(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Resume/`);
  }
}
