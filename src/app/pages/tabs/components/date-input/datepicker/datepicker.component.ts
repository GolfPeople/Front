import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {

  date: string;
  @Input() min;
  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  close(){
    this.modalController.dismiss();
  }

  saveDate() {
    this.modalController.dismiss({ date: this.date })
  }
}
