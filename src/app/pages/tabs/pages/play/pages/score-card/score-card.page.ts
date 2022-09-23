import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { CampusDataService } from '../../../campus/services/campus-data.service';
import { NewReviewComponent } from '../../../campus/pages/campus-detail/components/new-review/new-review.component';
import { PointsHitsModalComponent } from 'src/app/pages/tabs/components/points-hits-modal/points-hits-modal.component';
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

  limit;
  yds = [];

  holeData = [];
  stars = [];
  loadingCourse: boolean;

  players = [];
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
      user.points = data.points;
      user.hits = data.hits
      this.writePointsAndHits(user)
    }

  }


  async writePointsAndHits(user) {
    let data = {
      user_id: user.user.id,
      hole: this.selectedHole.value,
      hits: user.hits,
      points: user.points
    }

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

  nextHole() {
    if (this.selectedHole.value < this.limit) {
      this.selectedHole.next(this.selectedHole.value + 1);
      this.getRating();
      this.getPlayersData();
      this.getHCPYPAR();
      this.getHoleLevel();
      this.getYds();
      this.getHoleData();
      this.filterReviews();
    }
  }

  backHole() {
    if (this.selectedHole.value > 1) {
      this.selectedHole.next(this.selectedHole.value - 1);
      this.getRating();
      this.getPlayersData();
      this.getHCPYPAR();
      this.getHoleLevel();
      this.getYds();
      this.getHoleData();
      this.filterReviews();
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
  getGame() {
    this.loadingCourse = true;
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
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
        }
      }))    
      
      this.detail = this.gameSvc.games$.value.filter(res => res.id == this.id)[0];
     console.log(this.detail);
     
      if (this.detail.game_init.path == '1') {
        this.limit = 18;
      } else {
        this.limit = 9;
      }   
        
      this.getPlayersData();
      this.getHoleData();
      this.getGolfCourse(this.detail);
    })
  }


  getHoleData() {
    this.holeData = this.detail.points.filter(res => res.hole == this.selectedHole.value.toString());
  }

  

  getGolfCourse(game) {
    this.loadingCourse = true;
    this.campusSvg.getCourseGames(game.campuses_id).subscribe(res =>{
      
      this.course = res;
      this.course.teesList = JSON.parse(this.course.teesList);
      this.course.scorecarddetails = JSON.parse(this.course.scorecarddetails);
      
      this.getRating();
      this.getHCPYPAR();
      this.getHoleLevel();
      this.getYds();
      this.filterReviews();
      this.loadingCourse = false;
    })

  }

  getRating(){
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
    if(!op.length){
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
    let hcpHole = this.course.scorecarddetails.menScorecardList[0].hcpHole;
    let parHole = this.course.scorecarddetails.menScorecardList[0].parHole;

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
        name: u.data.name,        
        photo: u.data.profile.photo,
        points: points.filter(p => {return p.hole == this.selectedHole.value.toString()})[0].points,
        hits: points.filter(p => {return p.hole == this.selectedHole.value.toString()})[0].hits,
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