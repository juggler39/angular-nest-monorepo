import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class HttpService {

  constructor(private http: HttpClient) { };

  getCats(): Observable<any> {
    return this.http.get('http://localhost:3000/api/cats', { withCredentials: true })
  }
}
