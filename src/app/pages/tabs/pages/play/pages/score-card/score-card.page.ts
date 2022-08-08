import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.page.html',
  styleUrls: ['./score-card.page.scss'],
})
export class ScoreCardPage implements OnInit {

  id;
  detail;

  selectedHole = new BehaviorSubject(1);
  constructor(
    private translate: TranslateService,
    public gameSvc: GameService,
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private alertController: AlertController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.detail = this.gameSvc.games$.value.filter(res => res.id == this.id)[0];
  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getGame();
  }


  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  async editScoreCard(user) {
    const alert = await this.alertController.create({
      header: 'Golpes y Puntos',
      inputs: [
        {
          type: 'number',
          name: 'hits',
          placeholder: 'Golpes',
          min: 1,
          max: 100,
        },
        {
          type: 'number',
          name: 'points',
          placeholder: 'Puntos',
          min: 1,
          max: 100,
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'Aceptar',
          handler: (res) => {
            user.hits = res.hits;
            user.points = res.points;
          },
        },
      ]
    });

    await alert.present();
  }


  nextHole() {
    if (this.selectedHole.value < 18) {
      this.selectedHole.next(this.selectedHole.value + 1);
    }
  }

  backHole() {
    if (this.selectedHole.value > 1) {
      this.selectedHole.next(this.selectedHole.value - 1);
    }
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
      console.log(this.detail);

    })
  }

}