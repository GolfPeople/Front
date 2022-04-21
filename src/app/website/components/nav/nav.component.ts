import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu: boolean = false;
  userName: string;
  constructor(
    private loginService: LoginService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  onLogout() {
    this.loginService.logout();
  }
}
