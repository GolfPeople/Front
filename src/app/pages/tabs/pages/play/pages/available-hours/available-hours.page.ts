import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DatepickerComponent } from '../../../../components/date-input/datepicker/datepicker.component';

@Component({
  selector: 'app-available-hours',
  templateUrl: './available-hours.page.html',
  styleUrls: ['./available-hours.page.scss'],
})
export class AvailableHoursPage implements OnInit {

 
  alter = []
  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    
  }

  selectHour(h){
    h.isChecked = !h.isChecked
    let hours = this.alter.filter(hour => { return hour.isChecked == true });
    this.gameSvc.game.value.hours = hours;
  }

  async datePicker() {
    const modal = await this.modalController.create({
      component: DatepickerComponent,
      cssClass: 'datepicker-modal' ,        
    });

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.gameSvc.game.value.date = data.date;         
    }
  }

  nextGotReservation(){
    this.gameSvc.game.value.skipExtra = true;
    this.firebaseSvc.routerLink('tabs/play/resumen');
  }

  nextDontGotReservation(){
    this.gameSvc.game.value.skipExtra = false;
    this.firebaseSvc.routerLink('tabs/play/extras');
  }

}
