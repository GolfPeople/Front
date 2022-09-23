import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-schedule',
  templateUrl: './select-schedule.component.html',
  styleUrls: ['./select-schedule.component.scss'],
})
export class SelectScheduleComponent implements OnInit {

  days = [
    { name: 'Lunes', isChecked: false },
    { name: 'Martes', isChecked: false },
    { name: 'Miércoles', isChecked: false },
    { name: 'Jueves', isChecked: false },
    { name: 'Viernes', isChecked: false },
    { name: 'Sábado', isChecked: false },
    { name: 'Domingo', isChecked: false },
  ]

  hourInit = '';
  hourEnd = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() { }


  submit(){
    let schedule = {
      days: this.days.filter(res => res.isChecked == true).map(res => {return (res.name)}),
      hourInit: this.hourInit,
      hourEnd: this.hourEnd
    }
   this.modalController.dismiss({schedule})
  }

  validator() {
    let days = this.days.filter(res => res.isChecked == true);
    if (!days) {
      return false;
    }
    if (!this.hourInit) {
      return false;
    }
    if (!this.hourEnd) {
      return false;
    }
    return true;
  }
}
