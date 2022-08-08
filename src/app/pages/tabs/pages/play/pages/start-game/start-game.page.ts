import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.page.html',
  styleUrls: ['./start-game.page.scss'],
})
export class StartGamePage implements OnInit {

  date = Date.now();
  path;
  modality;
  loading: boolean;

  id;
  detail;

  optionsPath = [
    { name: 'Recorrido 1 - 18 Hoyos', value: 1 },
    { name: 'Recorrido 2 - 9 Hoyos', value: 2 }
  ];
  optionsModality = ['Match Play', 'Medal Play', 'Stableford', 'Fourball', 'Greensome'];

  constructor(
    private translate: TranslateService,
    public gameSvc: GameService,
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.detail = this.gameSvc.games$.value.filter(res => res.id == this.id)[0];
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getGame();
  }

  validator() {
    if (!this.modality) {
      return false;
    }
    if (!this.path) {
      return false;
    }

    return true;
  }

  submit() {
    let data = {
      path: this.path,
      modality: this.modality
    }
    this.loading = true;
    this.gameSvc.startGame(this.id, data).subscribe(res => {      
      this.firebaseSvc.Toast(this.translate.instant('Has iniciado la partida'));
      this.firebaseSvc.routerLink('/tabs/play/score-card');
      this.loading = false;
    }, error => {
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'));
      this.loading = false;
    })
  }

  getGame() {

    this.gameSvc.getAllGames().subscribe(res => {
        
      this.gameSvc.games$.next(res.data.reverse().map(g => {
        return {
          address: g.address,
          created_at: g.created_at,
          date: g.date,
          id: g.id,
          lat: g.lat,
          long: g.long,
          name: g.name,
          reserves: g.reserves,
          isOwner: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '4').length ? true : false),
          owner_id: g.users.filter(u => u.status == '4')[0].user_id,
          users: g.users.filter(u => { return ['2', '4'].includes(u.status) }),
          fav: false,
          isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '2').length ? true : false),
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
        }
      }))

      this.detail = this.gameSvc.games$.value.filter(res => res.id == this.id)[0];
    })
  }
}
