import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {
  items: any = [
    {
      text: 'DESCRICIÓN DEL CAMPO',
      route: ['description'],
    },
    {
      text: 'HOYOS',
      route: ['hoyos'],
    },
    {
      text: 'RESEÑAS',
      route: ['resenas'],
    },
    {
      text: 'PUBLICACIONES',
      route: ['posts'],
    },
    {
      text: 'MENSAJES',
      route: ['messages'],
    },
    {
      text: 'MIEMBROS',
      route: ['members'],
    },
  ];

  constructor() {}

  ngOnInit() {}
}
