import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent implements OnInit {
  // date_picker_element = document.querySelector('.date-picker');
  // selected_date_element = document.querySelector('.date-picker .selected-date');
  // dates_element = document.querySelector('.date-picker .dates');
  // isActive: boolean = false;

  @Output() date = new EventEmitter<string>();

  day: string;
  month: string;
  year: string;

  constructor() {}

  ngOnInit() {}

  selectDate(event: Event) {
    const element = event.target as HTMLInputElement;
    const date = element.value;
    const splitDate = date.split('-').reverse();
    this.day = splitDate[0];
    this.year = splitDate[2];

    if (splitDate[1] === '01') this.month = 'Enero';
    if (splitDate[1] === '02') this.month = 'Febrero';
    if (splitDate[1] === '03') this.month = 'Marzo';
    if (splitDate[1] === '04') this.month = 'Abril';
    if (splitDate[1] === '05') this.month = 'Mayo';
    if (splitDate[1] === '06') this.month = 'Junio';
    if (splitDate[1] === '07') this.month = 'Julio';
    if (splitDate[1] === '08') this.month = 'Agosto';
    if (splitDate[1] === '09') this.month = 'Septiembre';
    if (splitDate[1] === '10') this.month = 'Octubre';
    if (splitDate[1] === '11') this.month = 'Noviembre';
    if (splitDate[1] === '12') this.month = 'Diciembre';

    // this.month = splitDate[1];

    // console.log(splitDate);
    this.date.emit(date);
  }

  // toggleDatePicker(e) {
  //   console.log(e.path);
  //   // if (this.checkEventPathForClass(e.path, 'dates')) {
  //   //   this.dates_element.classList.toggle('active');
  //   // }
  //   this.isActive = !this.isActive;
  // }

  // //HELPER FUNCTIONS
  // checkEventPathForClass(path, selector) {
  //   for (let i = 0; 1 < path.length; i++) {
  //     if (path[i].classList && path[i].classlist.contains(selector)) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }
}
