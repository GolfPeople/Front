import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { LoadingController } from '@ionic/angular';
import { Tournament } from 'src/app/core/models/game.model';
import { SwiperOptions } from 'swiper';

declare const google;

@Component({
  selector: 'app-reservation-tournament',
  templateUrl: './reservation-tournament.page.html',
  styleUrls: ['./reservation-tournament.page.scss'],
})
export class ReservationTournamentPage implements OnInit {

  @ViewChild('mapElement', { static: false }) mapElement;
  public id :string;
  tournaments : Tournament;
  loading: boolean;
  isMember:any;
  services = [];

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };
  
  constructor(
    private route:ActivatedRoute,
    public tournamentSvc: TournamentService,
    private loadingCtrl: LoadingController
  ) {
    this.tournaments = new Tournament();
   } 
  

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });

    await loading.present();
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    this.tournamentSvc.getTournamentDetail(this.id).subscribe(res => {
      
      this.tournaments = res; 
      let dataServicesJson = eval(res.services);
      console.log(dataServicesJson);
      this.services = dataServicesJson;
           
      if (res.lat) {
        this.createMap(res.lat, res.long);
      }
      console.log(this.tournaments);
      loading.dismiss();
    })

  }

  
  ngAfterViewInit(): void {
   // this.createMap();  
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  async createMap(lat, long) {
    let latitude = lat;
    let longitude = long;
    const map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 5,
        center: {lat: parseInt(latitude) , lng: parseInt(longitude)},
      }
    );

    new google.maps.Marker({
      position:{lat: parseInt(latitude) , lng: parseInt(longitude)},
      map,
      title: 'Map',
      icon: '../../../../../assets/img/marker-golfp.png'
    });
  }
 
}
