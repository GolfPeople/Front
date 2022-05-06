import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './core/services/login.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isLogged: boolean;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    this.userSvc.getUserID();
    this.loginService.isLogged$.subscribe((res) => {
      console.log('El usuario está logueado: ', res);
      this.isLogged = res;
    });
    if (this.isLogged === true) {
      // this.router.navigate(['/website']);
    }
  }
}
