import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game, Tournament } from '../models/game.model';

const API = `${environment.golfpeopleAPI}/api`

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

 
  constructor(private http: HttpClient) {
  }

  getTournamentDetail(id) {
    return this.http.get<any>(`${API}/tournaments/show/${id}`)
  }  
}
