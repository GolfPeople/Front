import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CampusService } from 'src/app/core/services/campus/campus.service';
import { GameService } from 'src/app/core/services/game.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.page.html',
  styleUrls: ['./create-tournament.page.scss'],
})
export class CreateTournamentPage implements OnInit {

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  campus = [];
  campusSelected;
  date$ = new BehaviorSubject('');
  creating: boolean;
  loading: boolean;

  constructor(
    private firebaseSvc: FirebaseService,
    private campusSvc: CampusService,
    public gameSvc: GameService,
    private modalController: ModalController
  ) { }

  ngOnInit() {

  }

  selectServices(s) {
    s.isChecked = !s.isChecked
  }


  async submit() {
    this.gameSvc.tournament.value.date = this.date$.value;
    if (!this.gameSvc.tournament.value.price) {
      const modal = await this.modalController.create({
        component: AlertConfirmComponent,
        cssClass: 'alert-confirm',
        componentProps: {
          confirmText: 'Aceptar',
          content: '¿Estas seguro de que las entradas de tu evento serán gratis?'
        }
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      if (data) {
        this.firebaseSvc.routerLink('/tabs/play/tournament-resumen');
      }
    } else {
      this.firebaseSvc.routerLink('/tabs/play/tournament-resumen');
    }
  }

  validator() {
    if (!this.gameSvc.tournament.value.photo) {
      return false
    }
    if (!this.gameSvc.tournament.value.name) {
      return false
    }
    if (!this.gameSvc.tournament.value.owner_name) {
      return false
    }
    if (!this.date$.value) {
      return false
    }
    if (!this.gameSvc.tournament.value.services) {
      return false
    }
    if (!this.gameSvc.tournament.value.description) {
      return false
    }
    if (!this.gameSvc.tournament.value.link) {
      return false
    }
    if (!this.gameSvc.tournament.value.course) {
      return false
    }

    return true;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  ionViewWillEnter() {
    this.getAllCampus();
  }

  getAllCampus() {
    this.loading = true;
    this.campusSvc.getAllCampus().subscribe(res => {
      this.loading = false;
      this.campus = res.data;
    })
  }

  async addImages() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      promptLabelHeader: 'Imagen',
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
      source: CameraSource.Prompt
    });

    this.gameSvc.tournament.value.photo = image.dataUrl;   
  }
}
