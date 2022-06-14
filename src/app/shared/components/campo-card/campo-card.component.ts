import { Component, OnInit, Input } from '@angular/core';
import { Campus } from 'src/app/core/models/campus.interface';

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

  constructor() {}

  ngOnInit() {
    this.designer = JSON.parse(this.campo.designer);
    console.log(this.designer);
  }

  showCampo() {}

  save() {}

  share() {}
}
