import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {
  optionButtons = [
    {
      text: 'Tienda',
      selected: false,
    },
    {
      text: 'Buggies',
      selected: false,
    },
    {
      text: 'Equipamiento',
      selected: false,
    },
    {
      text: 'Clases',
      selected: false,
    },
    {
      text: 'Restaurante',
      selected: false,
    },
    {
      text: 'Entretenimiento',
      selected: false,
    },
    {
      text: 'Equipamiento',
      selected: false,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
