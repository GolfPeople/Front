import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CampusDataService } from '../../../campus/services/campus-data.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { TournamentService } from 'src/app/core/services/tournament.service';

@Component({
  selector: 'app-validate-score-card-tournament',
  templateUrl: './validate-score-card-tournament.page.html',
  styleUrls: ['./validate-score-card-tournament.page.scss'],
})
export class ValidateScoreCardTournamentPage implements OnInit {

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
  isInvited= false;
  holeData = [];
  players:any = [];
  course_id;

  isNotValidatedGame:number;
  constructor(
    private translate: TranslateService,
    public gameSvc: GameService,
    private actRoute: ActivatedRoute,
    public tournamentSvc: TournamentService,
    private firebaseSvc: FirebaseService,
    public campusSvg: CampusDataService,
    private modalController: ModalController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getTournament();
  }


  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

    /**
 *=================== Validar partida========================
 * @param tournament_id  
 */
 async validateGame() {
  const modal = await this.modalController.create({
    component: AlertConfirmComponent,
    cssClass: 'alert-confirm',
    componentProps: {
      confirmText: 'Si, válidar y finalizar',
      content: '¿Estas seguro de que quieres validar los resultados y cerrar el torneo?',
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
    tournament_id: this.id
  }

  const loading = await this.firebaseSvc.loader().create();
  await loading.present();
  this.gameSvc.validateTournamentScoreCard(data).subscribe(res => {

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
  this.gameSvc.changeTournamentStatus(this.id,4).subscribe(res => {

    this.firebaseSvc.routerLink(`/tabs/play/game-finished-tournament/+${this.detail.campuses_id}/${this.id}`)
    
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


  getTournament() {
   

    this.tournamentSvc.getTournamentDetail(this.id).subscribe(res => {
       
      (res.players.filter(u => 
        {
          if(u.user.id == JSON.parse(localStorage.getItem('user_id')) &&  u.admin == 1){
            this.isInvited = true; 
           } 
        }));
   
    })

    console.log('this.isInvited')
    console.log(this.isInvited)

    this.gameSvc.getTournaments().subscribe(res => {

      this.gameSvc.tournament$.next(res.data.reverse().map(t => {
       

          return {
            id: t.id,
            campuses_id: t.campuses_id,
            tournament_init: t.tournament_init,
            address: t.address,
            created_at: t.created_at,
            name: t.name,
            date: t.date,
            players: t.players,
            price: t.price,
            lat: t.lat,
            points: t.points,
            long: t.long,
            services: t.services,
            isMember: (t.players.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
            isInvited: (t.players.filter(u => u.user.id == JSON.parse(localStorage.getItem('user_id')) &&  u.admin == 1).length ? true : false ),
          //  isMember: (t.players.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status)).length ? true : false),
         
            description: t.description,
            image: t.image,
            status: t.status,
            courses: t.courses, 
           }
      }))

      this.detail = this.gameSvc.tournament$.value.filter(res => res.id == this.id)[0];

      if (this.detail.tournament_init.path == '1') {
        this.limit = 18;
      } else {
        this.limit = 9;
      }

      this.getGolfCourse(this.detail);
    })
  }

  getGolfCourse(game) {
   
    this.campusSvg.getCourseTournament(game.campuses_id).subscribe(res =>{
      
      this.course = res;
      this.course.teesList = JSON.parse(this.course.teesList);
      this.course.scorecarddetails = JSON.parse(this.course.scorecarddetails);
      this.getPlayersData();
    })

  }

  getPlayersData() {
    this.parHole = this.course.scorecarddetails.menScorecardList[0].parHole;
    
    this.players = this.detail.players.map(u => {
      let points = this.detail.points.filter(res => { return res.user_id == u.user_id }).map(r => {
        return {
          points: r.points,
          hits: r.hits,
          hole: r.hole
        }
      })
      console.log(u);
      return { 
        id: u.user.id,
        name: u.user.name,        
        photo: u.user.profile.photo,
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
