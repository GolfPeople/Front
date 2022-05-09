import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../core/services/user.service';

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

  birthday;
  day: string;
  month: string;
  year: string;
  limitDate: string = new Date()
    .toLocaleDateString()
    .split('/')
    .reverse()
    .join('-');

  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log(this.limitDate);
    this.userService.getUserInfo().subscribe((res) => {
      console.log(res);
      if (res.profile.birthday) {
        this.birthday = res.profile.birthday;
        console.log('TEST init -->', this.birthday);
        this.dateValues(this.birthday);
      }
      return;
    });
  }

  dateValues(date) {
    const dateSplit = date.split('-').reverse();
    this.day = dateSplit[0];
    this.year = dateSplit[2];

    if (dateSplit[1] === '01') this.month = 'Enero';
    if (dateSplit[1] === '02') this.month = 'Febrero';
    if (dateSplit[1] === '03') this.month = 'Marzo';
    if (dateSplit[1] === '04') this.month = 'Abril';
    if (dateSplit[1] === '05') this.month = 'Mayo';
    if (dateSplit[1] === '06') this.month = 'Junio';
    if (dateSplit[1] === '07') this.month = 'Julio';
    if (dateSplit[1] === '08') this.month = 'Agosto';
    if (dateSplit[1] === '09') this.month = 'Septiembre';
    if (dateSplit[1] === '10') this.month = 'Octubre';
    if (dateSplit[1] === '11') this.month = 'Noviembre';
    if (dateSplit[1] === '12') this.month = 'Diciembre';
  }

  selectDate(event: Event) {
    const element = event.target as HTMLInputElement;
    const date = element.value;
    console.log('DATE -->', date);
    this.dateValues(date);

    this.date.emit(date);
  }
}
