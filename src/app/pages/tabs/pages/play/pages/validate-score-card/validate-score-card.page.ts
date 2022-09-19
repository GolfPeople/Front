import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CampusDataService } from '../../../campus/services/campus-data.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';

@Component({
  selector: 'app-validate-score-card',
  templateUrl: './validate-score-card.page.html',
  styleUrls: ['./validate-score-card.page.scss'],
})
export class ValidateScoreCardPage implements OnInit {

  date = Date.now()


  id;
  detail;
  course;
  selectedHole = new BehaviorSubject(1);

  hcpHole = [];
  parHole = [];
  level;

  limit;
  yds = [];

  holeData = [];
  players:any = [];
  course_id;

  isNotValidatedGame:number;
  constructor(
    private translate: TranslateService,
    public gameSvc: GameService,
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    public campusSvg: CampusDataService,
    private modalController: ModalController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
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

    /**
 *=================== Validar partida========================
 * @param game_id 
 */
 async validateGame() {
  const modal = await this.modalController.create({
    component: AlertConfirmComponent,
    cssClass: 'alert-confirm',
    componentProps: {
      confirmText: 'Si, válidar y finalizar',
      content: '¿Estas seguro de que quieres validar los resultados y cerrar la partida?',
      inverseBtn: true
    }
  });

  modal.present();

  const { data } = await modal.onWillDismiss();
  if (data) {
    this.validate();
  }
}

async validate() {
  let data = {
    user_id: JSON.parse(localStorage.getItem('user_id')),
    game_id: this.id
  }

  const loading = await this.firebaseSvc.loader().create();
  await loading.present();
  this.gameSvc.validateScoreCard(data).subscribe(res => {

   this.finishGame();
    
    loading.dismiss();
  }, error => {
    console.log(error);
    
    this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    loading.dismiss();
  })
}


async finishGame(){
  const loading = await this.firebaseSvc.loader().create();
  await loading.present();
  this.gameSvc.changeGameStatus(this.id,4).subscribe(res => {

    this.firebaseSvc.routerLink(`/tabs/play/game-finished-success/+${this.detail.campuses_id}/${this.id}`)
    
    loading.dismiss();
  }, error => {
    console.log(error);
    
    this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    loading.dismiss();
  })
}

  openPlayerData(player) {
    for (let p of this.players) {
      if (p.id == player.id) {
        p.opened = !p.opened;
      } else {
        p.opened = false;
      }
    }
  }


  getGame() {

    this.gameSvc.getAllGames().subscribe(res => {

      this.gameSvc.games$.next(res.data.reverse().map(g => {
        return {
          campuses_id: g.campuses_id,
          address: g.address,
          created_at: g.created_at,
          points: g.points,
          date: g.date,
          id: g.id,
          lat: g.lat,
          long: g.long,
          name: g.name,
          game_init: g.game_init,
          reserves: g.reserves,
          isOwner: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '4').length ? true : false),
          owner_id: g.users.filter(u => u.status == '4')[0].user_id,
          users: g.users.filter(u => { return ['2', '4'].includes(u.status) }),
          fav: false,
          isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '2').length ? true : false),
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
          validate:(g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status) && u.validate).length ? true : false)
        }
      }))

      this.detail = this.gameSvc.games$.value.filter(res => res.id == this.id)[0];

      if (this.detail.game_init.path == '1') {
        this.limit = 18;
      } else {
        this.limit = 9;
      }

      this.getGolfCourse(this.detail);
    })
  }



  getGolfCourse(game) {

    this.campusSvg.getData().subscribe(res => {

      this.course = res.data.filter(c => game.campuses_id == c.id)[0];
      this.course.teesList = JSON.parse(this.course.teesList);
      this.course.scorecarddetails = JSON.parse(this.course.scorecarddetails);

      this.getPlayersData();

    })
  }

  getPlayersData() {
    this.parHole = this.course.scorecarddetails.menScorecardList[0].parHole;
    this.players = this.detail.users.map(u => {
      let points = this.detail.points.filter(res => { return res.user_id == u.user_id }).map(r => {
        return {
          points: r.points,
          hits: r.hits,
          hole: r.hole
        }
      })
      return {
        id: u.user_id,
        name: u.data.name,        
        photo: u.data.profile.photo,
        teeColor: u.teeColor,
        totalHits: points.reduce((i, j) => i + parseInt(j.hits), 0),
        totalPoints: points.reduce((i, j) => i + parseInt(j.points), 0),
        totalPar9: this.parHole.slice(0,9).reduce((i, j) => i + j, 0),
        totalPar18: this.parHole.slice(9,18).reduce((i, j) => i + j, 0),
        totalHits9: points.slice(0,9).reduce((i, j) => i + parseInt(j.hits), 0),
        totalHits18: points.slice(9,18).reduce((i, j) => i + parseInt(j.hits), 0),
        totalPoints9: points.slice(0,9).reduce((i, j) => i + parseInt(j.points), 0),
        totalPoints18: points.slice(9,18).reduce((i, j) => i + parseInt(j.points), 0),
        par9: this.parHole.slice(0,9),
        par18: this.parHole.slice(9,18),
        points9: points.slice(0,9),
        points18: points.slice(9,18),
        opened: false
      }
    }).sort(function (a, b) {
      if (a.totalPoints < b.totalPoints) {
        return 1;
      }
      if (a.totalPoints > b.totalPoints) {
        return -1;
      }
      return 0;
    });   
  }

}
