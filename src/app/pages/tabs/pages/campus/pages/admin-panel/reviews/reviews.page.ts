import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../services/campus-data.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  detail;
  average = new BehaviorSubject(0 as any);

  reviews = new BehaviorSubject([]);
  filterSelected = '1'
  filters = [
    { id: '1', name: 'Más recientes' },
    { id: '2', name: 'Destacados' },
    { id: '3', name: 'Últimos' },
  ]
  config: SwiperOptions = {
    slidesPerView: 2.5,
    spaceBetween: 10,
  };
  id;
  constructor(
    private actRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService,  
    public campusSvg: CampusDataService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.detail = this.campusSvg.golfCourses.value.filter(res => res.id == this.id)[0];  
  }

  ngOnInit() {
    this.getGolfCourse();
  }

  filterReviews(id){
this.filterSelected = id;
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
      this.average.next(rating);



    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }
}
