import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game, Tournament } from '../models/game.model';

const API = `${environment.golfpeopleAPI}/api`

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game: BehaviorSubject<Game> = new BehaviorSubject({} as Game);
  tournament = new BehaviorSubject({} as Tournament)


  step$ = new BehaviorSubject(1);
  title$ = new BehaviorSubject('');
  games$ = new BehaviorSubject([]);
  constructor(private http: HttpClient) {
    this.game.value.extra = [];
    this.game.value.hours = [];

    this.game.value.reservation = [
      { id: '1', name: 'Buggy', icon: 'assets/icons/buggy.svg', isChecked: false },
      { id: '2', name: 'Palos', icon: 'assets/icons/equipment.svg', isChecked: false },
      { id: '2', name: 'Caddy', icon: 'assets/icons/caddy.svg', isChecked: false },
    ];

    this.tournament.value.services = [
      { id: '1', name: 'Buggy', icon: 'assets/icons/buggy.svg', isChecked: false },
      { id: '2', name: 'Equipo', icon: 'assets/icons/equipment.svg', isChecked: false },
      { id: '3', name: 'Comida', icon: 'assets/icons/food.svg', isChecked: false },
      { id: '4', name: 'Pack de Bienvenida', icon: 'assets/icons/welcome-pack.svg', isChecked: false },
    ];
    this.tournament.value.price = 0;
  }

  resetTournamentForm() {
    this.tournament = new BehaviorSubject({} as Tournament);
    this.tournament.value.services = [
      { id: '1', name: 'Buggy', icon: 'assets/icons/buggy.svg', isChecked: false },
      { id: '2', name: 'Equipo', icon: 'assets/icons/equipment.svg', isChecked: false },
      { id: '3', name: 'Comida', icon: 'assets/icons/food.svg', isChecked: false },
      { id: '4', name: 'Pack de Bienvenida', icon: 'assets/icons/welcome-pack.svg', isChecked: false },
    ];
    this.tournament.value.price = 0;
  }

  getHoursTotal() {
    return this.game.value.hours.reduce((i, j) => i + j.price * 1, 0);
  }

  getExtrasTotal() {
    return this.game.value.extra.reduce((i, j) => i + j.price * 1, 0);
  }

  getTotal() {
    this.game.value.total = this.getHoursTotal() + this.getExtrasTotal();
    return this.game.value.total;
  }

  createGame(game) {
    return this.http.post<any>(`${API}${environment.createGame}`, game)
  }

  acceptOrDeclineGameRequest(opc, game_id) {
    return this.http.post<any>(`${API}${environment.gameToggle}${opc}`, { game_id })
  }

  acceptOrDeclineJoinRequest(opc, game_id, user_id) {
    return this.http.post<any>(`${API}${environment.gameRequestToggle}${opc}`, { game_id, user_id })
  }

  joinRequest(game_id) {
    return this.http.post<any>(`${API}${environment.joinRequest}`, { game_id })
  }

  changeGameStatus(game_id, opc) {
    return this.http.post<any>(`${API}${environment.gameStatus}${game_id}/${opc}`, {})
  }

  validateScoreCard(data){
    //data: {user_id, game_id}
    return this.http.post<any>(`${API}/games/validate/user`, data)
  }

  removeGame(game_id) {
    return this.http.post<any>(`${API}${environment.destroyGame}${game_id}`, {})
  }

  getAllGames() {
    return this.http.get<any>(`${API}${environment.games}`)
  }

  startGame(id, data) {
    return this.http.post<any>(`${API}/games/init/${id}`, data)
  }

  writePointsAndHits(id, data) {
    return this.http.post<any>(`${API}/games/points/${id}`, data)
  }


  getTournaments() {
    return this.http.get<any>(`${API}/tournaments/show/all`)
  }

  createTournament(data) {
    return this.http.post<any>(`${API}/tournaments/create/`, data)
  }

  selectStartColor(game_id, data) {
    return this.http.post<any>(`${API}/games/color/${game_id}`, data)
  }  
  
  updateGame(game_id, data){

    console.log(game_id, data);
    
    return this.http.post<any>(`${API}/games/edit/${game_id}`, data)
  }

  addPlayersToGame(game_id, data){
    return this.http.post<any>(`${API}/games/add/users/${game_id}`, data)
  }

  removePlayersFromGame(game_id, data){
    return this.http.post<any>(`${API}/games/remove/users/${game_id}`, data)
  }
}
