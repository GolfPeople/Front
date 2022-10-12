import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { LoadingController } from '@ionic/angular';
import { Tournament } from 'src/app/core/models/game.model';
import { SwiperOptions } from 'swiper';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';

declare const google;

@Component({
  selector: 'app-reservation-tournament',
  templateUrl: './reservation-tournament.page.html',
  styleUrls: ['./reservation-tournament.page.scss'],
})
export class ReservationTournamentPage implements OnInit {

  @ViewChild('mapElement', { static: false }) mapElement;
  public id: string;
  tournaments: Tournament;
  loading: boolean;
  isMember: any;
  services = [];

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  constructor(
    private route: ActivatedRoute,
    public tournamentSvc: TournamentService,
    private loadingCtrl: LoadingController,
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
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

  async wantToJoin(e) {

    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Reservar',
        content: '¿Quieres reservar esta plaza?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.sendJoinRequest(e);
    }
  }

  async sendJoinRequest(e) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    let users = [];
    let user_id = JSON.parse(localStorage.getItem('user_id'));
    users.push(user_id);


    let data = {
      users
    }

    //
    // this.gameSvc.changeTournamentStatus(this.tournaments.id, 1).subscribe(res => {
    //mensaje por definir
    // this.firebaseSvc.Toast('La partida ha sido restaurada');

    //   loading.dismiss();
    // }, error => {
    //   this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    //   loading.dismiss();
    // })

    //agrega los jugadores a los torneos pero se comento por que en el grupo comentaros algo de los estatus que aun no comprendo

    this.gameSvc.addPlayersToTournaments(this.tournaments.id, data).subscribe(res => {
      //  this.firebaseSvc.Toast('Se ha enviado invitación a los jugadores agregados');
      console.log(res);

      this.firebaseSvc.routerLink('/tabs/play');
      loading.dismiss();//tabs/play/success-request
    }, err => {
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo.');
    })

  }

  activityNotification(e) {
    let activity = { id: e.owner_id.toString(), user_id: e.owner_id, notification: true }
    this.firebaseSvc.addToCollectionById('activity', activity);
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
        center: { lat: parseInt(latitude), lng: parseInt(longitude) },
      }
    );

    new google.maps.Marker({
      position: { lat: parseInt(latitude), lng: parseInt(longitude) },
      map,
      title: 'Map',
      icon: '../../../../../assets/img/marker-golfp.png'
    });
  }

}
