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
  averageRating = new BehaviorSubject({} as any);
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

  }

  ngOnInit() {
   
  }


  goToHoles() {
    this.firebaseSvc.routerLink('/tabs/campus/hole-detail/' + this.detail.id)
  }

ionViewWillEnter(){
  this.getGolfCourse();
}
  
  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
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


  async getGolfCourse() {

    try{
      const { data } = await this.campusSvg.getData().toPromise();
      
      this.campusSvg.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];
      if(!this.detail) return;

      this.detail.teesList = JSON.parse(this.detail.teesList);
      this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);
      this.detail.designer = JSON.parse(this.detail.designer);
      this.detail.hour = JSON.parse(this.detail.hour);
      this.detail.day = JSON.parse(this.detail.day);
      this.detail.services = JSON.parse(this.detail.services);     
      let averageLevel: any = [];

      this.detail.reviews.map(res => {
        averageLevel.push(parseInt(res.difficulty))        
      }) 
      let level = (averageLevel.reduce((a, b) => a + b, 0) / this.detail.reviews.length).toFixed(0);   
      this.averageLevel.next(level);


      let priceAverage: any = [];
      let locationAverage: any = [];
      let facilitiesAverage: any = [];
      let restaurantAverage: any = [];
      let storeAverage: any = [];

      this.detail.ratings.map(res => {
        priceAverage.push(parseInt(res.price))
        locationAverage.push(parseInt(res.location))
        facilitiesAverage.push(parseInt(res.facilities))
        restaurantAverage.push(parseInt(res.restaurant))
        storeAverage.push(parseInt(res.store))        
      })

      console.log(this.detail.ratings);     

      let price = (priceAverage.reduce((a, b) => a + b, 0) / this.detail.ratings.length).toFixed(0)                   
      let location = (locationAverage.reduce((a, b) => a + b, 0) / this.detail.ratings.length).toFixed(0)
      let restaurant = (restaurantAverage.reduce((a, b) => a + b, 0) / this.detail.ratings.length).toFixed(0)
      let store = (storeAverage.reduce((a, b) => a + b, 0) / this.detail.ratings.length).toFixed(0)
      let facilities = (facilitiesAverage.reduce((a, b) => a + b, 0) / this.detail.ratings.length).toFixed(0)

      let average = {
        general: (parseInt(price)  + parseInt(location) + parseInt(restaurant) + parseInt(store) + parseInt(facilities))/5,
        price: parseInt(price),
        location: parseInt(location),
        restaurant: parseInt(restaurant),
        store: parseInt(store),
        facilities: parseInt(facilities)
      }

      this.averageRating.next(average);
      
      
      this.reviews.next(this.detail.ratings.map(res =>{
        return{
          comment: res.comment,
          rating: ((parseInt(res.price)  + parseInt(res.location) + parseInt(res.restaurant) + parseInt(res.store) + parseInt(res.facilities))/5).toFixed(0),
          user: res.user,
          created_at: res.created_at,
          id: res.id,
          photos: JSON.parse(res.photos),
          user_id: res.user_id          
        }
      }));
    } catch(e) {
      console.log("Error getGolfCourse::> ",e);
    }
    
  }
}
