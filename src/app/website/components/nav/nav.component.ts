import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu: boolean = false;
  constructor(private loginService: LoginService) {}

  ngOnInit() {}

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  onLogout() {
    this.loginService.logout();
  }
}
