import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import {  ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';
import { CreateFieldPage } from '../create-field/create-field.page';
import { CampusDataService } from './services/campus-data.service';

declare const google;

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
  @ViewChild('mapElement', { static: false }) mapElement;
  map;

  hiddenMap: boolean = true;
  hiddenCourses: boolean = false;
  constructor(
    public campusSvg: CampusDataService,   
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService
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

  golfCourseDetail(id){ 
    this.firebaseSvc.routerLink('/tabs/campus/campus-detail/'+id)
  }


  async createMap(markers) {

  let first = markers[1];

    const map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 5,
        center: first.position,
      }
    );
  
    for(let m of markers){
     let marker = new google.maps.Marker({
        position: m.position,
        map,
        title: m.title,   
        icon: m.icon 
      });

      marker.addListener("click", () => {
        this.golfCourseDetail(m.title)
      });
    }    
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }


  getGolfCourses() {
    this.loading = true;
    this.campusSvg.getData().subscribe(async ({ data }) => {  
      this.campusSvg.golfCourses.next(data.reverse());
      this.loading = false;
      // console.log(this.campusSvg.golfCourses.value);
        
      let markers: Marker[] = data.map(m => {
        return {
          position: {
            lat: parseInt(m.latitude),
            lng: parseInt(m.longitude)
          },
          title: m.id.toString(),
          icon: '../../../../../assets/img/marker-golfp.png'
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
