import { Component, OnInit, ViewChild } from '@angular/core';
import { Marker } from '@capacitor/google-maps';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CreateFieldPage } from '../create-field/create-field.page';
import { CampusDataService } from './services/campus-data.service';

declare const google;

@Component({
  selector: 'app-campus',
  templateUrl: './campus.page.html',
  styleUrls: ['./campus.page.scss'],
})
export class CampusPage implements OnInit {

  golfCourses = [];
  searchedCampos
  text: string = '';
  myAddress: string = '';

  coords;

  loading: boolean;
  @ViewChild('mapElement', { static: false }) mapElement;
  map;

  hiddenMap: boolean = true;

  search = '';
  constructor(
    public campusSvg: CampusDataService,
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService
  ) { }

  async ngOnInit() {
    this.getCourses()
  }

  golfCourseDetail(id) {
    this.firebaseSvc.routerLink('/tabs/campus/campus-detail/' + id)
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

    for (let m of markers) {
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

  getCourses() {
    this.loading = true;
    this.campusSvg.searchCourses(this.search).subscribe(res => {
      this.campusSvg.golfCourses.next(res.all_courses);

      this.loading = false;

      let markers: Marker[] = res.all_courses.map(m => {
        return {
          position: {
            lat: parseInt(m.latitude),
            lng: parseInt(m.longitude)
          },
          title: m.id.toString(),
          icon: 'assets/img/marker-golfp.png'
        }
      })

      if (markers) {
        this.createMap(markers);
      }

    }, err => {
      console.log(err);

    })
  }



  async createCamp() {
    const modal = await this.modalCtrl.create({
      component: CreateFieldPage,
    });
    await modal.present();
  }


}
