import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
import { Login } from '../interfaces/login';
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlApi: string = `${environment.URI}User/`;

  constructor(private readonly http: HttpClient) { }

  getList(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}List/`);
  }

  login(request: Login): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Login/`, request);
  }

  register(request: User): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Register/`, request);
  }

  edit(request: User): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Edit/`, request);
  }

  delete(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Delete/${id}`);
  }
  
}
