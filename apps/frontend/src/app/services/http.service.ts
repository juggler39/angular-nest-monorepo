import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
const API_PATH = environment.apiPath

@Injectable({
  providedIn: 'root',
})

export class HttpService {

  constructor(private http: HttpClient) { }

  getCats(): Observable<any> {
    return this.http.get(`${API_PATH}/cats`, { withCredentials: true })
  }
}
