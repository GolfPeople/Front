import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'complete-profile.page.html',
  styleUrls: ['complete-profile.page.scss'],
})
export class CompleteProfilePage {
  constructor(private loginService: LoginService, private router: Router) {}

  onlogout() {
    this.loginService.logout();
    this.router.navigate(['/welcome']);
  }
}
