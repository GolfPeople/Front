import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pics',
  templateUrl: './pics.component.html',
  styleUrls: ['./pics.component.scss'],
})
export class PicsComponent implements OnInit {

  @Input() photos;

  images = [
    '../../../../../../../../../assets/img/hole_img/1.png',
    '../../../../../../../../../assets/img/hole_img/2.png',
    '../../../../../../../../../assets/img/hole_img/3.png',
    '../../../../../../../../../assets/img/hole_img/3.png',
    '../../../../../../../../../assets/img/hole_img/2.png',
    '../../../../../../../../../assets/img/hole_img/1.png',
  ]

  constructor() { }

  ngOnInit() {}

}
