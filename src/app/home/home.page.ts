import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService} from '../login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  onlogout(){
    this.loginService.logout();
    this.router.navigateByUrl('/welcome');
  }

}
