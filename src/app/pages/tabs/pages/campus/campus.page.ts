import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { LoadingController, ModalController } from '@ionic/angular';
import { Campus } from 'src/app/core/models/campus.interface';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { CreateFieldPage } from '../create-field/create-field.page';
import { CampusMapModalComponent } from './components/campus-map-modal/campus-map-modal.component';
import { CampusDataService } from './services/campus-data.service';

declare let google: any;

@Component({
  selector: 'app-campus',
  templateUrl: './campus.page.html',
  styleUrls: ['./campus.page.scss'],
})
export class CampusPage implements OnInit {
  geocoder = new google.maps.Geocoder();

  golfCourses = [];
  searchedCampos
  text: string = '';
  myAddress: string = '';

  coords;

  loading: boolean;
  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;

  hiddenMap: boolean = true;
  hiddenCourses: boolean = false;
  constructor(
    private campusSvg: CampusDataService,   
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.getGolfCourses();
  }


  hideGolfCourses(){
    this.hiddenMap = !this.hiddenMap;
    if(!this.hiddenMap){
      setTimeout(() => {
        this.hiddenCourses = !this.hiddenCourses;
      }, 600);
    }else{
      this.hiddenCourses = !this.hiddenCourses;
    }
  }

  ionViewDidEnter() {
   
  }

  async createMap(markers) {
   
    let firstLocation = markers.map(r => {
      return (r.coordinate)
    })[1]

    this.map = await GoogleMap.create({
      id: 'map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      forceCreate: true,
      config: {
        center: firstLocation,
        zoom: 3,
      }
    })

    this.addMarkers(markers)
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

 async addMarkers(markers) { 
    await this.map.addMarkers(markers);  
    this.map.setOnMarkerClickListener(async (marker) => {
      console.log(marker);   
    })
  }

  getGolfCourses() {
    this.loading = true;
    this.campusSvg.getData(1).subscribe(async ({ data }) => {  
      this.golfCourses = data.reverse();
      this.loading = false;

      let markers: Marker[] = data.map(m => {
        return {
          coordinate: {
            lat: parseInt(m.latitude),
            lng: parseInt(m.longitude)
          },
          title: JSON.stringify(m),
          iconUrl: '../../../../../assets/img/marker-golfp.png'
        }
      })

      if (markers) {
         this.createMap(markers);   
      }

      },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }


  
  async createCamp() {
    const modal = await this.modalCtrl.create({
      component: CreateFieldPage,
    });
    await modal.present();
  }


}
