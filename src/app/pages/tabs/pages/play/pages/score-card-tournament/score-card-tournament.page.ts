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
  selector: 'app-score-card-tournament',
  templateUrl: './score-card-tournament.page.html',
  styleUrls: ['./score-card-tournament.page.scss'],
})
export class ScoreCardTournamentPage implements OnInit {

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
    this.getTournament();
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
      user.hits = data.hits;
      user.user_id = user.user.user_id,
      this.writePointsTournamentAndHits(user)
    }

  }


  async writePointsTournamentAndHits(user) {
    console.log(user)
    let data = {
      user_id: user.user_id,
      hole: this.selectedHole.value,
      hits: user.hits,
      points: user.points
    }
    console.log(data)

    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.gameSvc.writePointsTournamentAndHits(this.detail.id, data).subscribe(res => {
      this.getTournament();
      loading.dismiss();
    }, error => {
      console.log(error);

      loading.dismiss();
    })

  }

  nextHole() {
    if (this.selectedHole.value < this.limit) {
      this.selectedHole.next(this.selectedHole.value + 1);

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
  }

  backHole() {
    if (this.selectedHole.value > 1) {
      this.selectedHole.next(this.selectedHole.value - 1);
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
      this.getTournament();
    } 
  }
  getTournament() {
    this.loadingCourse = true;
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
          points: t.points,
          price: t.price,
          lat: t.lat,
          long: t.long,
          services: t.services,
          isMember: (t.players.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
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


      this.getPlayersData();
      this.getHoleData();
      this.getHoleLikes();
      this.getGolfCourse(this.detail);
    })
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

  getGolfCourse(game) {
    this.loadingCourse = true;
    this.campusSvg.getCourseTournament(game.campuses_id).subscribe(res => {

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
    })

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
    this.players = this.detail.players.map(u => {
      console.log(u);
      let points = this.detail.points.filter(res => { return res.user_id == u.user_id }).map(r => {
        return {
          points: r.points,
          hits: r.hits,
          hole: r.hole
        }
      })
      return {
        id: u.user.user_id,
        user: u,
        name: u.user.name,
        photo: u.user.profile.photo,
        points: points.filter(p => { return p.hole == this.selectedHole.value.toString() })[0].points,
        hits: points.filter(p => { return p.hole == this.selectedHole.value.toString() })[0].hits,
        teeColor: u.user.teeColor
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