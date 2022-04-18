import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { UserService } from 'src/app/core/services/user.service';
import { Step6Service } from './step6.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.page.html',
  styleUrls: ['./step6.page.scss'],
})
export class Step6Page implements OnInit {
  gender;
  birthday: string;
  address: string;

  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;

  constructor(
    private Step6Svc: Step6Service,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.printCurrentPosition();
  }

  async printCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
  }

  chooseGender(event) {
    const element = event.target;
    if (element.value === '1') {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.gender = 1;
      return;
    }
    if (element.value === '2') {
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.gender = 2;
      return;
    }
    if (element.value === '3') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.gender = 3;
      return;
    }
  }

  getDate(date: string) {
    console.log(date);
    this.birthday = date;
  }

  onSubmit() {
    this.Step6Svc.dateAndLocation(
      this.birthday,
      this.gender,
      this.address
    ).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/step2']);
    });
    setTimeout(() => {
      this.userService.getUserInfo().subscribe((rta) => console.log(rta));
    }, 3000);
  }
}
