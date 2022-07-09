import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DatepickerComponent } from './datepicker/datepicker.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements OnInit {

  defaultDate = Date.now();
  @Input() day;
  @Input() date;
  @Input() placeholder;
  @Input() min;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async datePicker() {
    const modal = await this.modalController.create({
      component: DatepickerComponent,
      cssClass: 'datepicker-modal' ,
      componentProps: {min: this.min}     
    });

    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.date.next(data.date);     
    }
  }
 
}
