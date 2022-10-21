import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { CampusDataService } from '../../../campus/services/campus-data.service';
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
  course;
yds = [];

  optionsPath = [
    { name: 'Recorrido 1 - 18 Hoyos', value: 1 },
    { name: 'Recorrido 2 - 9 Hoyos', value: 2 }
  ];
  optionsModality = ['Match Play', 'Medal Play', 'Stableford', 'Fourball', 'Greensome', 'Contra Par'];
  optionsScoringModes = ['Stableford', 'Contra Par', 'Stroke Play', 'Match Play'];
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
    this.getGame();
  }

 async addColor() {
    let data = {
      user_id: JSON.parse(localStorage.getItem('user_id')),
      color: this.selectedTee
    }
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.gameSvc.selectStartColor(this.id, data).subscribe(res => {   
      this.firebaseSvc.Toast(this.translate.instant('Has iniciado la partida'));
      this.firebaseSvc.routerLink('/tabs/play/score-card/'+this.id);  
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
    
    this.gameSvc.startGame(this.id, data).subscribe(res => {      
      this.addColor();
      loading.dismiss();
    }, error => {
      console.log('error en iniciar: ',error);
      
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'));
      loading.dismiss();
    })
  }

  getGame() {

    this.gameSvc.getAllGames().subscribe(res => {
        
      this.gameSvc.games$.next(res.data.reverse().map(g => {
        return {
          address: g.address,
          created_at: g.created_at,
          campuses_id: g.campuses_id,
          date: g.date,
          id: g.id,
          lat: g.lat,
          long: g.long,
          name: g.name,
          reserves: g.reserves,
          game_init: g.game_init,
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
        
      this.currentUser = this.detail.users.filter(res => res.id == JSON.parse(localStorage.getItem('user_id')))[0];
      this.getGolfCourse(this.detail.campuses_id);
    })
  }

  getGolfCourse(id){
    this.campusSvg.getCourseGames(id).subscribe(res =>{
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
