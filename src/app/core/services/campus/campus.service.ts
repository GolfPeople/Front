import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Campus } from '../../models/campus.interface';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class CampusService {
  private campus = new BehaviorSubject<Campus>({
    id: 0,
    information: '',
    services: '',
    designer: '',
    day: '',
    hour: '',
    location: '',
  });
  campus$ = this.campus.asObservable();

  constructor(private http: HttpClient) {}

  setCampus(campus: Campus) {
    this.campus.next(campus);
    localStorage.setItem('edit_campus', JSON.stringify(campus));
    console.log('Campo selecionado', campus);
  }

  createCamp(
    information: string,
    services: string[],
    photo: Blob,
    photoCampus: Blob,
    name: string,
    title: string,
    year: string,
    days: string[],
    hours: string[],
    lat: any,
    long: any,
    location: string
  ) {
    const formData = new FormData();
    formData.append('information', information);
    services.forEach((item) => {
      formData.append('services[]', item);
    });
    formData.append('photo', photo, `${photo.size}${new Date().getTime()}`);
    formData.append(
      'photoCampus',
      photoCampus,
      `${photoCampus.size}${new Date().getTime()}`
    );
    formData.append('name', name);
    formData.append('title', title);
    formData.append('year', year);
    days.forEach((item) => {
      formData.append('day[]', item);
    });
    hours.forEach((item) => {
      formData.append('hour[]', item);
    });
    formData.append('lat', lat);
    formData.append('long', long);
    formData.append('location', location);
  }

  edit(
    id,
    information: string,
    services: string[],
    photo: Blob,
    name: string,
    title: string,
    year: any,
    days: string[],
    hours: string[],
    location: string,
    lat: any,
    long: any,
    photoCampus: Blob
  ) {
    const formData = new FormData();
    formData.append('information', information);
    services.forEach((item) => {
      formData.append('services[]', item);
    });
    formData.append('photo', photo);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('year', year);
    days.forEach((item) => {
      formData.append('day[]', item);
    });
    hours.forEach((item) => {
      formData.append('hour[]', item);
    });
    formData.append('location', location);

    formData.append('lat', lat);
    formData.append('long', long);
    formData.append('photoCampus', photoCampus);

    return this.http.post(`${URL}/campus/edit/1/${id}`, formData);
  }
}
