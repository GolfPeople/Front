import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ten-stars-rating',
  templateUrl: './ten-stars-rating.component.html',
  styleUrls: ['./ten-stars-rating.component.scss'],
})
export class TenStarsRatingComponent implements OnInit {

  @Input() rating;

  constructor() { }

  ngOnInit() {}

  selectRating(value) {
    this.rating.next(value);
  }
}
