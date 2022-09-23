import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tournament } from 'src/app/core/models/game.model';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
declare const google;
@Component({
  selector: 'app-tournament-resumen',
  templateUrl: './tournament-resumen.page.html',
  styleUrls: ['./tournament-resumen.page.scss'],
})
export class TournamentResumenPage implements OnInit {

  date = Date.now();

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  @ViewChild('mapElement', { static: false }) mapElement;
  creating: boolean;
  services = [];
  constructor(
    private firebaseSvc: FirebaseService,
    public gameSvc: GameService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.services = this.gameSvc.tournament.value.services.filter(res => res.isChecked == true);
    this.createMap();
  }

  async submit() {

    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    let image = await this.firebaseSvc.uploadPhoto('tournaments/' + this.gameSvc.tournament.value.photo.slice(30, 40), this.gameSvc.tournament.value.photo);

    let data = {
      courses_id: this.gameSvc.tournament.value.course.id,
      name: this.gameSvc.tournament.value.name,
      date: this.gameSvc.tournament.value.date,
      price: this.gameSvc.tournament.value.price,
      address: this.gameSvc.tournament.value.course.address,
      lat: this.gameSvc.tournament.value.course.latitude,
      long: this.gameSvc.tournament.value.course.longitude,
      services: this.gameSvc.tournament.value.services.filter(res => res.isChecked == true),
      description: this.gameSvc.tournament.value.description,
      image: image,
    }

    this.gameSvc.createTournament(data).subscribe(res => {
      this.firebaseSvc.routerLink('/tabs/play');
      this.gameSvc.resetTournamentForm(); 
      this.firebaseSvc.Toast('Torneo creado exitosamente');
      loading.dismiss();
    }, error => {
      loading.dismiss();
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo');
      console.log(error);
    })
  }

  async createMap() {

    const map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 5,
        center: { lat: parseInt(this.gameSvc.tournament.value.course.latitude), lng: parseInt(this.gameSvc.tournament.value.course.longitude) },
      }
    );

    new google.maps.Marker({
      position: { lat: parseInt(this.gameSvc.tournament.value.course.latitude), lng: parseInt(this.gameSvc.tournament.value.course.longitude)  },
      map,
      title: 'hola',
      icon: 'assets/img/marker-golfp.png'
    });
  }
}
