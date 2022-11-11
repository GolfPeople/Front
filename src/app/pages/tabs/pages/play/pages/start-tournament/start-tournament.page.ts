import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { CampusDataService } from '../../../campus/services/campus-data.service';
@Component({
  selector: 'app-start-tournament',
  templateUrl: './start-tournament.page.html',
  styleUrls: ['./start-tournament.page.scss'],
})
export class StartTournamentPage implements OnInit {

  date = Date.now();
  path; 
  modality;
  loading: boolean;

  id;
  detail;
  course;
yds = [];

  optionsPath = [
    { name: 'Recorrido 1 - 18 Hoyos', value: 1 },
    { name: 'Recorrido 2 - 9 Hoyos', value: 2 }
  ];
  optionsModality = ['Match Play', 'Medal Play', 'Stableford', 'Fourball', 'Greensome'];
  selectedTee = '';
  currentUser;
  constructor(
    private translate: TranslateService,
    public gameSvc: GameService,
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    public campusSvg: CampusDataService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getTournament();
  }

 async addColor() {
    let data = {
      user_id: JSON.parse(localStorage.getItem('user_id')),
      color: this.selectedTee
    }
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.gameSvc.selectStartTournamentsColor(this.id, data).subscribe(res => {   
      this.firebaseSvc.Toast(this.translate.instant('Has iniciado el torneo'));
      this.firebaseSvc.routerLink('/tabs/play/score-card-tournament/'+this.id);  
      loading.dismiss(); 
    }, error => {
      console.log('error en agregar color: ',error);
      loading.dismiss();
    })
  }

 selectTee(tee){
  this.selectedTee = tee;
 }

  validatorStandar() {
    if (!this.modality) {
      return false;
    }
    if (!this.path) {
      return false;
    }
    if (!this.selectedTee) {
      return false;
    }
    return true;
  }

  validatorColor() {
    if (!this.selectedTee) {
      return false;
    }
    return true;
  }

 async submit() {
    let data = {
      path: this.path,
      modality: this.modality      
    }
 
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
     
    this.gameSvc.startTournament(this.id, data).subscribe(res => {  
      this.addColor();
      loading.dismiss();
    }, error => {
      console.log('error en iniciar: ',error);
      
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'));
      loading.dismiss();
    })
  }

  getTournament() {

    this.gameSvc.getTournaments().subscribe(res => {
        
    //  this.gameSvc.games$.next(res.data.reverse().map(t => {
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
              points: t.points,
              lat: t.lat,
              long: t.long,
              services: t.services,
              isMember: (t.players.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
            //  isMember: (t.players.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status)).length ? true : false),
           
              description: t.description,
              image: t.image,
              status: t.status,
              courses: t.courses, 
         }
      }))

      this.detail = this.gameSvc.tournament$.value.filter(res => res.id == this.id)[0];
         
   //   this.currentUser = this.detail.users.filter(res => res.id == JSON.parse(localStorage.getItem('user_id')))[0];
      this.getGolfCourse(this.detail.campuses_id);
    })
  }

  getGolfCourse(id){
    this.campusSvg.getCourseTournament(id).subscribe(res =>{
      this.course = res; 
      this.course.teesList = JSON.parse(this.course.teesList); 
      this.getYds();                    
    })
  }

  getYds() { 
    this.yds = [];
        
    for (let t of this.course.teesList.teesList) {
      t.ydsHole.map((res, index) => {
        if (index == 0) {
          this.yds.push({ yds: res, color: t.teeColorValue, colorName: t.teeColorName});
        }
      })
    }
   
  }
}
