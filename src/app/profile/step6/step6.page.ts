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

  constructor(
    private Step6Svc: Step6Service,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.printCurrentPosition();
  }

  async printCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
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
