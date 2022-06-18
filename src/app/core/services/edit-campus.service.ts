import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Campus } from '../models/campus.interface';

@Injectable({
  providedIn: 'root',
})
export class EditCampusService {
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

  constructor() {}

  setCampus(campus: Campus) {
    this.campus.next(campus);
    localStorage.setItem('edit_campus', JSON.stringify(campus));
    console.log('Campo selecionado', campus);
  }
}
