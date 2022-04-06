import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  isLogged: boolean;


  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
  
  }

}
