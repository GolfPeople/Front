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

  constructor(
    private step3Service: Step3Service,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.type === 0) {
      return window.alert('Tienes que selecionar un tipo de jugador');
    }
    this.step3Service.type(this.type).subscribe((rta) => {
      console.log(rta);
      this.router.navigate(['/step5']);
    });
    setTimeout(() => {
      this.userService.getUserInfo().subscribe((rta) => console.log(rta));
    }, 3000);
  }
}
