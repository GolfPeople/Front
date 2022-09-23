import { Component, OnInit, Input } from '@angular/core';
import { Campus } from 'src/app/core/models/campus.interface';
import { CampusService } from 'src/app/core/services/campus/campus.service';
import { EditCampusService } from 'src/app/core/services/edit-campus.service';

interface Designer {
  name: string;
  title: string;
  url: string;
  year: string;
}

@Component({
  selector: 'app-campo-card',
  templateUrl: './campo-card.component.html',
  styleUrls: ['./campo-card.component.scss'],
})
export class CampoCardComponent implements OnInit {
  @Input() campo: Campus;
  designer: Designer = {
    name: '',
    title: '',
    url: '',
    year: '',
  };
  cardTitle: string = '';

  constructor(private campusSvc: CampusService) {}

  ngOnInit() {
    this.designer = JSON.parse(this.campo.designer);    
  }

  selectCampus(campus: Campus) {
    this.campusSvc.setCampus(campus);
  }

  showCampo() {}

  save() {}

  share() {}
}
