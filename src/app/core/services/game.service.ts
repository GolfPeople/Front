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
  toggleGameType$ = new BehaviorSubject(false);
  toggleUserGames$ = new BehaviorSubject(false);
  step$ = new BehaviorSubject(3);
  title$ = new BehaviorSubject('');
  games$ = new BehaviorSubject([]);
  constructor(private http: HttpClient) { 
    this.game.value.extra = [];  
    this.game.value.hours = [];  
  }

  getHoursTotal(){
    return this.game.value.hours.reduce((i, j) => i + j.price * 1, 0);
  }

  getExtrasTotal(){
    return this.game.value.extra.reduce((i, j) => i + j.price * 1, 0);
  }

  getTotal(){
    this.game.value.total = this.getHoursTotal() + this.getExtrasTotal();
    return this.game.value.total;
  }

  createGame(game) {
    return this.http.post<any>(`${API}${environment.createGame}`, game)
  }
 
  acceptOrDeclineGameRequest(opc, game_id) {
    return this.http.post<any>(`${API}${environment.gameToggle}${opc}`, {game_id})
  }

  acceptOrDeclineJoinRequest(opc, game_id, user_id) {
    return this.http.post<any>(`${API}${environment.gameRequestToggle}${opc}`, {game_id, user_id})
  }

  joinRequest(game_id) {    
    return this.http.post<any>(`${API}${environment.joinRequest}`, {game_id})
  }

  changeGameStatus(game_id, opc){
    return this.http.post<any>(`${API}${environment.gameStatus}${game_id}/${opc}`, {}) 
  }

  removeGame(game_id){
    return this.http.post<any>(`${API}${environment.destroyGame}${game_id}`, {}) 
  }

  getAllGames(){
    return this.http.get<any>(`${API}${environment.games}`)
  }
 
  startGame(id, data){
    return this.http.post<any>(`${API}/games/init/${id}`, data) 
  }
}
