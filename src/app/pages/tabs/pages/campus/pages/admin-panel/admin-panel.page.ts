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
  campus: Campus;
  designer: any;

  constructor(private campusSvc: CampusService) {}

  ngOnInit() {
    this.campusSvc.campus$.subscribe((data) => {
      this.campus = data;
      // console.log('Campus', data);
      // this.designer = JSON.parse(data.designer);
      // console.log(this.designer);
    });

    this.campus = JSON.parse(localStorage.getItem('edit_campus'));
    this.designer = JSON.parse(this.campus.designer);
    // console.log('campus', this.campus);
    // console.log('designer', this.designer);
  }
}
