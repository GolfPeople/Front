import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string = '';
  cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
    });
  }
}
