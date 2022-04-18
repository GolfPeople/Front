import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Step3Service } from './step3.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.page.html',
  styleUrls: ['./step3.page.scss'],
})
export class Step3Page implements OnInit {
  type: number = 0;

  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;
  isActive4: boolean;
  isActive5: boolean;

  constructor(
    private step3Service: Step3Service,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe(({ profile }) => {
      if (profile.type) {
        this.type = profile.type;
        profile.type === 1
          ? (this.isActive1 = true)
          : profile.type === 2
          ? (this.isActive2 = true)
          : profile.type === 3
          ? (this.isActive3 = true)
          : profile.type === 4
          ? (this.isActive4 = true)
          : profile.type === 5
          ? (this.isActive5 = true)
          : null;
      }
    });
  }

  chooseTypePlayer(event) {
    const element = event.target;

    if (element.value == '1') {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = false;
      this.type = 1;
      return;
    }
    if (element.value == '2') {
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = false;
      this.type = 2;
      return;
    }
    if (element.value == '3') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.isActive4 = false;
      this.isActive5 = false;
      this.type = 3;
      return;
    }
    if (element.value == '4') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = true;
      this.isActive5 = false;
      this.type = 4;
      return;
    }
    if (element.value == '5') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
      this.isActive5 = true;
      this.type = 5;
      return;
    }
  }

  onSubmit() {
    this.step3Service.type(this.type).subscribe((rta) => {
      console.log(rta);
      this.router.navigate(['/step5']);
    });
    setTimeout(() => {
      this.userService.getUserInfo().subscribe((rta) => console.log(rta));
    }, 3000);
  }
}
