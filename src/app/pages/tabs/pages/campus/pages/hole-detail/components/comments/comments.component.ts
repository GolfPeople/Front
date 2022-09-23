import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  @Input() reviews;
  @Input() selectedHole;
  filters = [
    { id: '1', name: 'Más recientes' },
    { id: '2', name: 'Destacados' },
    { id: '3', name: 'Últimos' },
  ]

  filterSelected = '1';
  date = Date.now();

  constructor() { }

  ngOnInit() { }

}
