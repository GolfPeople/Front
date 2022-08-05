import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../services/campus-data.service';
import { NewReviewComponent } from './components/new-review/new-review.component';


@Component({
  selector: 'app-campus-detail',
  templateUrl: './campus-detail.page.html',
  styleUrls: ['./campus-detail.page.scss'],
})
export class CampusDetailPage implements OnInit {

  detail;
  averageRating = new BehaviorSubject(0 as any);
  averageLevel = new BehaviorSubject(0 as any);

  reviews = new BehaviorSubject([]);
  selectedSegment = '1';
  segments = [
    { id: '1', name: 'El Campo' },
    { id: '2', name: 'Reseñas' },
    { id: '3', name: 'Eventos' },
    { id: '4', name: 'Publicaciones' },
  ]

  id;
  constructor(
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    public campusSvg: CampusDataService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('detail');
    this.detail = this.campusSvg.golfCourses.value.filter(res => res.id == this.id)[0];  
  }

  ngOnInit() {
    this.getGolfCourse();
  }


  goToHoles() {
    this.firebaseSvc.routerLink('/tabs/campus/hole-detail/' + this.detail.id)
  }


  async newReview() {
    const modal = await this.modalController.create({
      component: NewReviewComponent,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7],
      componentProps: {
        campuses_id: this.detail.id
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.getGolfCourse();
    }
  }


  getGolfCourse() {

    this.campusSvg.getData().subscribe(async ({ data }) => {
      this.campusSvg.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];
      this.detail.teesList = JSON.parse(this.detail.teesList);
      this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);

      let averageRating: any = [];
      let averageLevel: any = [];

      this.reviews.next(this.detail.reviews.map(res => {

        averageLevel.push(parseInt(res.difficulty))
        averageRating.push(res.rating)

        let stars = []
        for (let i = 1; i < res.rating + 1; i++) {
          stars.push({ color: 'success' })
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

      let rating = (averageRating.reduce((a, b) => a + b, 0) / this.detail.reviews.length).toFixed(2);
      let level = (averageLevel.reduce((a, b) => a + b, 0) / this.detail.reviews.length).toFixed(0);
      this.averageRating.next(rating);
      this.averageLevel.next(level);


    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }
}
