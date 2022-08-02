import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-admin-request',
  templateUrl: './admin-request.page.html',
  styleUrls: ['./admin-request.page.scss'],
})
export class AdminRequestPage implements OnInit {

  detail;
  user;

  constructor(
    private actRoute: ActivatedRoute,
    private userService: UserService
  ) {

    this.detail = atob(this.actRoute.snapshot.paramMap.get('detail'));
    this.detail = JSON.parse(this.detail);
    this.getUserData();
  }
  ngOnInit() {

  }

  

  getUserData(){
    this.userService.user$.subscribe((data) => {
      this.user = data;    
    });
  }
}