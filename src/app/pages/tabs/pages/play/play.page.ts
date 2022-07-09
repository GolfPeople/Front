import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  toggleOptionsGameType = { one: 'Partidas', two: 'Torneos' };
  toggleOptionsUserGames = { one: 'Partidas', two: 'Mis Partidas' };
  toggleGameType$ = new BehaviorSubject(false);
  toggleUserGames$ = new BehaviorSubject(false);
  date$ = new BehaviorSubject('')
  games = [];

  fav;
  avatar: string = 'assets/img/default-avatar.png';

  loading: boolean;
  constructor(private gameSvc: GameService) { }

  ngOnInit() { 
  }

  ionViewWillEnter(){
    this.getAllGames()
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  getAllGames() {
    this.loading = true;
    this.gameSvc.getAllGames().subscribe(res => {
      this.loading = false;
      this.games = res.data.reverse();
    })
  }
}
