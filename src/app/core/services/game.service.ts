import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from '../models/game.model';

const API = `${environment.golfpeopleAPI}/api`

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game: BehaviorSubject<Game> = new BehaviorSubject({} as Game)
  step$ = new BehaviorSubject(3);
  title$ = new BehaviorSubject('');
  constructor(private http: HttpClient) { 
    this.game.value.extra = [];  
    this.game.value.hours = [];  
  }


  createGame(game) {
    return this.http.post<any>(`${API}${environment.createGame}`, game)
  }

  getAllGames(){
    return this.http.get<any>(`${API}${environment.games}`)
  }
}
