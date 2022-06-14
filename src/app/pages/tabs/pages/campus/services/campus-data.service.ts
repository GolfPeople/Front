import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CampusResponse } from 'src/app/core/models/campus.interface';
import { environment } from 'src/environments/environment';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class CampusDataService {
  constructor(private http: HttpClient) {}

  getData(page) {
    const params = new HttpParams().set('page', page);
    return this.http.get<CampusResponse>(`${URL}/campus/show/all`, { params });
  }
}
