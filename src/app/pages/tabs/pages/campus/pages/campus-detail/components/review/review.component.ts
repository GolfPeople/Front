import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {

  @Input() reviews;
  @Input() average;
  filterSelected = '1'
  filters = [
    { id: '1', name: 'Más recientes' },
    { id: '2', name: 'Destacados' },
    { id: '3', name: 'Últimos' },
  ]

  date = Date.now();

  stars = [];
  constructor() { }

  ngOnInit() {
  this.getStars()
  }

  getStars(){
    for (let i = 1; i < this.average.value.general+1; i++) {
      this.stars.push('1')
    }   
  }
}
