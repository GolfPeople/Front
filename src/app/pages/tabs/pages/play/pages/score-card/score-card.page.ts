import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { CampusDataService } from '../../../campus/services/campus-data.service';
import { NewReviewComponent } from '../../../campus/pages/campus-detail/components/new-review/new-review.component';
import { PointsHitsModalComponent } from 'src/app/pages/tabs/components/points-hits-modal/points-hits-modal.component';
import { COEFICIENTE } from 'src/app/core/constant';


@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.page.html',
  styleUrls: ['./score-card.page.scss'],
})

export class ScoreCardPage implements OnInit {

  id;
  detail;
  course;
  selectedHole = new BehaviorSubject(1);
  reviews = new BehaviorSubject([])

  hcpHole;
  parHole;
  level;
  hcpValueJuego;
  limit;
  yds = [];
  teesLists = [];

  holeData = [];
  hitsExtraData = [];
 // listWER={};
  listWER=[];
  stars = [];
  loadingCourse: boolean;

  players = [];

  likeCounter: number;
  liked: boolean;

  constructor(
    private translate: TranslateService,
    public gameSvc: GameService,
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private alertController: AlertController,
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


  async editScoreCard(user) {
    const modal = await this.modalController.create({
      component: PointsHitsModalComponent,
      cssClass: 'points-hits',
      componentProps: {
        points: parseInt(user.points),
        hits: parseInt(user.hits)
      }
    });

    modal.present();
   
    const { data } = await modal.onWillDismiss();

    if (data) {
      user.points = this.calcPoints(data.hits, user);
      //user.points = parseInt(user.points),
      user.hits = data.hits;
      user.user_id = user.user.user_id,
      
      this.writePointsAndHits(user)
    }

  }


  calcPoints(hits, user){
    let miPuntuacion;
    let golpesExtrasUser = this.golpesExtrasUser(user.id);
    let miGolpeExtra = golpesExtrasUser[0].golpesExtra[this.selectedHole.value-1];

    if (this.detail.game_init.modality == "Stableford"){

      const stablefordScore = [
        {"points":5, "name":"Albatros",    "color":"red"},
        {"points":4, "name":"Eagle",       "color":"limegreen"},
        {"points":3, "name":"Birdie",      "color":"dodgerblue"},
        {"points":2, "name":"Par",         "color":"white"},
        {"points":1, "name":"Bogey",       "color":"lightgrey"},
        {"points":0, "name":"Doble Bogey", "color":"dimgrey"}
      ];

      let diferencia = hits - miGolpeExtra - this.parHole;

      switch (true) {
        case (diferencia <= -3):
            miPuntuacion = stablefordScore[0];
            break;
        case (diferencia == -2):
            miPuntuacion = stablefordScore[1];
            break;
        case (diferencia == -1):
            miPuntuacion = stablefordScore[2];
            break;
        case (diferencia == 0):
            miPuntuacion = stablefordScore[3];
            break;
        case (diferencia == 1):
            miPuntuacion = stablefordScore[4];
            break;
        default:
            miPuntuacion = stablefordScore[5];
            break;
      }

      return miPuntuacion.points;
    }
    else if (this.detail.game_init.modality == "Contra Par"){

      const contraParScore = [
        {"points":1,  "name":"Bajo par",  "color":"red"},
        {"points":0,  "name":"Par",       "color":"white"},
        {"points":-1, "name":"Sobre par", "color":"dimgrey"},
      ];

      let diferencia = hits - miGolpeExtra - this.parHole;

      switch (true) {
        case (diferencia < 0):
            miPuntuacion = contraParScore[0];
            break;
        case (diferencia == 0):
            miPuntuacion = contraParScore[1];
            break;
        case (diferencia > 0):
            miPuntuacion = contraParScore[2];
            break;
        default:
            miPuntuacion = contraParScore[2];
            break;
      }

      return miPuntuacion.points;
    }

    return hits;
  }

  golpesExtras(users: any[]){
    
    this.campusSvg.getCourseGames(this.detail.campuses_id).subscribe(course => {
      this.course = course;
      const porcentaje = 0.95;
      
      users.filter( user =>{
  
        let gender = '';
        if (user.data.profile.gender == 2){
          gender = 'men';
        }
        else if (user.data.profile.gender == 1){
          gender = 'wmn';
        }
        else if (user.data.profile.gender == 3){
          // cuando el usuario no tiene género no puede consultar 'user.data.profile.gender', 
          // se debe almacenar el género previamente escogido al inicio de la partida y usarlo aquí
          gender = '';
        }
    
        this.getTeesLists();
        let genderColor = gender + user.teeColor;
        
        let myTeelist : Tee | undefined = this.teesLists[genderColor];
        
        if (!!myTeelist) {
          let hcpJuego = Math.round(porcentaje * (parseFloat(user.data.profile.handicap) * myTeelist.slope / COEFICIENTE + myTeelist.rating - myTeelist.parTotal));

          let golpesExtra = [];

          for (var i = 0; i < this.course.layoutTotalHoles; i++) {

            let goplesExtraMinimoHoyo = Math.trunc(hcpJuego / this.course.layoutTotalHoles);
            let golpesExtraSobrante = 0;
        
            if (goplesExtraMinimoHoyo == 0){
              golpesExtraSobrante = hcpJuego;
            }
            else if (goplesExtraMinimoHoyo > 3){
              goplesExtraMinimoHoyo = 4;
              golpesExtraSobrante = 0;
            }
            else{
              golpesExtraSobrante = hcpJuego - (goplesExtraMinimoHoyo * this.course.layoutTotalHoles);
            }
        
            golpesExtra[i] = goplesExtraMinimoHoyo;
            if (myTeelist.hcpHole[i] <= golpesExtraSobrante){
                golpesExtra[i] = 1 + goplesExtraMinimoHoyo;
            }

          }

          let hcpJuegoUser = { UserId: user.data.profile.user_id, hcpJuego: hcpJuego, golpesExtra: golpesExtra };
          this.hitsExtraData[user.data.profile.user_id] = hcpJuegoUser;
          //this.hitsExtraData.push(hcpJuegoUser);
        }

      })
    })
  }

  golpesExtrasUser(user: number) {
    return this.hitsExtraData.filter(x => { return x.UserId == user; });
  }
  
  getTeesLists() {
    
    for (let t of JSON.parse(this.course.teesList).teesList) {
      let genderColor = t.gender + t.teeColorValue;
      let slope, rating, parTotal : number = 0;
      let hcpHole, parHole : Array<number> = [];
      
      if (t.gender == "men"){
        slope = t.slopeMen;
        rating = t.ratingMen;
        parTotal = JSON.parse(this.course.scorecarddetails).menScorecardList[0].parTotal;
        hcpHole = JSON.parse(this.course.scorecarddetails).menScorecardList[0].hcpHole;
        parHole = JSON.parse(this.course.scorecarddetails).menScorecardList[0].parHole;
      }
      else{
        slope = t.slopeWomen;
        rating = t.ratingWomen;
        parTotal = JSON.parse(this.course.scorecarddetails).wmnScorecardList[0].parTotal;
        hcpHole = JSON.parse(this.course.scorecarddetails).wmnScorecardList[0].hcpHole;
        parHole = JSON.parse(this.course.scorecarddetails).wmnScorecardList[0].parHole;
      }

      const TeeList: Tee = {
        gender: t.gender, 
        rating: rating, 
        slope: slope, 
        teeColorValue: t.teeColorValue, 
        teeColorName: t.teeColorName,
        parTotal: parTotal,
        hcpHole: hcpHole,
        parHole: parHole
      };

      this.teesLists[genderColor] = TeeList;
    }
  }


  async writePointsAndHits(user) {
    let data = {
      user_id: user.id,
      hole: this.selectedHole.value,
      hits: user.hits,
      points: user.points
    }

   // console.log(data);

    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.gameSvc.writePointsAndHits(this.detail.id, data).subscribe(res => {
      this.getGame();
      loading.dismiss();
    }, error => {
      console.log(error);

      loading.dismiss();
    })

  }

  getAllData() {
    this.getHoleData();
    this.getHoleLikes();
    this.getPlayersData();
    this.getHCPYPAR();
    this.getYds();

    if (this.course.reviews) {
      this.getRating();
      this.getHoleLevel();
      this.filterReviews();
    }
  }

  nextHole() {
    if (this.selectedHole.value < this.limit) {
      this.selectedHole.next(this.selectedHole.value + 1);
      this.getAllData();
    }
  }

  backHole() {
    if (this.selectedHole.value > 1) {
      this.selectedHole.next(this.selectedHole.value - 1);
      this.getAllData();
    }
  }

  async newReview() {
    const modal = await this.modalController.create({
      component: NewReviewComponent,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7],
      componentProps: {
        campuses_id: this.course.id,
        hole: this.selectedHole
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.getGame();
    }
  }
  async getGame() {
    this.loadingCourse = true;
    const res = await this.gameSvc.getAllGames().toPromise();
    
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
        pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
      }
    }))

    this.detail = this.gameSvc.games$.value.filter(res => res.id == this.id)[0];
    //console.log(this.detail);

    if (this.detail.game_init.path == '1') {
      this.limit = 18;
    } else {
      this.limit = 9;
    }

    this.getPlayersData();
    this.getHoleData();
    this.getHoleLikes();
    this.getusersExtrahits(); 
    await this.getGolfCourse(this.detail);
  }

  getusersExtrahits() {
    this.golpesExtras(this.detail.users);
  }

  getHoleData() {
    this.holeData = this.detail.points.filter(res => res.hole == this.selectedHole.value.toString());
  }

  getHoleLikes() {
    this.liked = false;
    this.likeCounter = 0;
    this.campusSvg.getHoleLikes(this.detail.campuses_id, this.selectedHole).subscribe(res => {
      this.likeCounter = res.count;

      //chequea si el usuario dio like al hoyo
      res.data.map(user => {
        if (user.user_id == JSON.parse(localStorage.getItem('user_id'))) {
          this.liked = true
        }
      })
    })
  }


  likeToHole() {
    this.liked = !this.liked;
    this.campusSvg.likeToHole(this.detail.campuses_id, this.selectedHole).subscribe(res => {
      this.likeCounter = res.count;

      //chequea si el usuario dio like al hoyo
      res.data.map(user => {
        if (user.user_id == JSON.parse(localStorage.getItem('user_id'))) {
          this.liked = true
        }
      })

    })
  }

  async getGolfCourse(game) {
    this.loadingCourse = true;
    const res = await this.campusSvg.getCourseGames(game.campuses_id).toPromise();
    this.course = res;
    this.course.teesList = JSON.parse(this.course.teesList);
    this.course.scorecarddetails = JSON.parse(this.course.scorecarddetails);

    this.getHCPYPAR();
    this.getYds();

    if (this.course.reviews) {
      this.getRating();
      this.getHoleLevel();
      this.filterReviews();
    }

    this.loadingCourse = false;
  }

  getRating() {
    let op = []
    this.course.reviews.filter(r => r.hole == this.selectedHole.value).map(res => {
      this.stars = []

      op.push(res)
      for (let i = 1; i < res.rating + 1; i++) {
        this.stars.push({ color: 'warning' })
      }

      if (this.stars.length < 5) {
        let reduce = 5 - this.stars.length;
        for (let i = 1; i < reduce + 1; i++) {
          this.stars.push({ color: 'medium' })
        }
      }


    })
    if (!op.length) {
      this.stars = []
    }


  }

  filterReviews() {
    let averageLevel: any = [];

    this.reviews.next(this.course.reviews.filter(r => r.hole == this.selectedHole.value).map(res => {
      averageLevel.push(parseInt(res.difficulty))
      let stars = []
      for (let i = 1; i < res.rating + 1; i++) {
        stars.push({ color: 'warning' })
      }

      if (stars.length < 5) {
        let reduce = 5 - stars.length;
        for (let i = 1; i < reduce + 1; i++) {
          stars.push({ color: 'medium' })
        }
      }
      return {
        created_at: res.created_at,
        description: res.description,
        difficulty: res.difficulty,
        rating: res.rating,
        user: res.user,
        stars: stars,
        hole: res.hole
      }
    }).reverse())


  }

  getYds() {
    this.yds = [];

    for (let t of this.course.teesList.teesList) {
      t.ydsHole.map((res, index) => {
        if (index == this.selectedHole.value - 1) {
          this.yds.push({ yds: res, color: t.teeColorValue, colorName: t.teeColorName });
        }
      })
    }

  }

  getHoleLevel() {
    let averageLevel: any = [];
    this.course.reviews.map(res => {

      averageLevel.push(parseInt(res.difficulty))

      return {
        difficulty: res.difficulty
      }
    })
    this.level = (averageLevel.reduce((a, b) => a + b, 0) / this.course.reviews.length).toFixed(0);
  }

  getHCPYPAR() {
    let hcpHole = this.course.scorecarddetails.menScorecardList[0].hcpHole; // no se puede poner por defecto menScorecardList, dependerá del sexo
    let parHole = this.course.scorecarddetails.menScorecardList[0].parHole; // no se puede poner por defecto menScorecardList, dependerá del sexo

    hcpHole.map((n, index) => {
      if (index == this.selectedHole.value - 1) {
        this.hcpHole = n;
      }
    });
    parHole.map((n, index) => {
      if (index == this.selectedHole.value - 1) {
        this.parHole = n;
      }
    });

  }


  getPlayersData() {
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
        user: u,
        name: u.data.name,
        gender: u.data.profile.gender, // si el usuario no tiene genero deberá escogerlo al comienzo de la partida y quedará guardado aquí
        photo: u.data.profile.photo,
        handicap: u.data.profile.handicap,
        points: points.filter(p => { return p.hole == this.selectedHole.value.toString() })[0].points,
        hits: points.filter(p => { return p.hole == this.selectedHole.value.toString() })[0].hits,
        extraHits: '**', // aquí debe guardarse un array con los golpes extras que tendrá el jugador. Debe calcularse antes de iniciar la partida
        teeColor: u.teeColor
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

interface Tee{
  gender: string;
  rating: number;
  slope: number;
  teeColorValue: string;
  teeColorName: string;
  parTotal: number;
  hcpHole: Array<number>;
  parHole: Array<number>;
}