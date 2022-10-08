import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { LoadingController } from '@ionic/angular';

declare const google;

@Component({
  selector: 'app-reservation-detail-tournament',
  templateUrl: './reservation-detail-tournament.page.html',
  styleUrls: ['./reservation-detail-tournament.page.scss'],
})
export class ReservationDetailTournamentPage implements OnInit {

  @ViewChild('mapElement', { static: false }) mapElement;
  public id :string;
  tournaments = [];
  loading: boolean;
  constructor(
    private route:ActivatedRoute,
    public tournamentSvc: TournamentService,
    private loadingCtrl: LoadingController
  ) { }
  

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });

    await loading.present();
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    this.tournamentSvc.getTournamentDetail(this.id).subscribe(res => {
  
      this.tournaments = res;
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
