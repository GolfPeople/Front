import { Component, OnInit } from '@angular/core';
import { Campus } from 'src/app/core/models/campus.interface';
import { CampusService } from 'src/app/core/services/campus/campus.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {
  items: any = [
    {
      name: 'DESCRICIÓN DEL CAMPO',
      route: ['description'],
    },
    {
      name: 'HOYOS',
      route: ['hoyos'],
    },
    {
      name: 'RESEÑAS',
      route: ['resenas'],
    },
    {
      name: 'PUBLICACIONES',
      route: ['posts'],
    },
    {
      name: 'MENSAJES',
      route: ['messages'],
    },
    {
      name: 'MIEMBROS',
      route: ['members'],
    },
  ];
  campus: Campus;
  designer: any;
  imageAvatarDefault = 'assets/img/default-img.png';
  constructor(private campusSvc: CampusService) {}

  ngOnInit() {
   
  }
}
