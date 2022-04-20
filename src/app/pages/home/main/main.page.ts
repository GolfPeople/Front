import { Component, OnInit } from '@angular/core';

import { SwiperComponent } from 'swiper/angular';

// import Swiper core and required modules
import SwiperCore, { Pagination } from 'swiper';

// install Swiper modules
SwiperCore.use([Pagination]);
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() {}

  ngOnInit() {}
}
