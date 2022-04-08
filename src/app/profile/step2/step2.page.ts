import { Component, OnInit } from '@angular/core';

import { Step2Service } from './step2.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.page.html',
  styleUrls: ['./step2.page.scss'],
})
export class Step2Page implements OnInit {
  // novato: number = 1;
  // medio: number= 2;
  // escalado: number = 3;
  // avanzado: number = 4;
  nivelSelecionado: number = 4;
  handicap: string = '';
  handicapDecimal: string = '00';
  handicapValue: string = `${this.handicap}.${this.handicapDecimal}`;
  timePlaying: number = 0;


  public experience: any;

  constructor(
    private step2Service: Step2Service,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}

  getHandicapValue(e) {
    const element = e.target.value;

    this.handicap = element;

    console.log(element);
  }

  getDecimalValue(e) {
    const element = e.target.value;

    this.handicapDecimal = element;

    console.log(element);
  }

  selecionarNivel(nivel: number) {
    this.nivelSelecionado = nivel;
    console.log('Nivel selecionado ', this.nivelSelecionado);
  }

  onSubmit() {
    // const handicap = this.handicap;
    const timePlaying = this.timePlaying;
    const handicap = parseFloat(`${this.handicap}.${this.handicapDecimal}`);
    console.log('el handicap es', handicap);
    if (handicap === 0 && timePlaying === 0) {
      return window.alert('Los campos son abligatorios');
    }
    if (this.handicap.length > 2) {
      return window.alert('El handicap no puede ser mayor de 54');
    }
    if (this.handicapDecimal.length > 2) {
      return window.alert('El decimal no puede tener más e dos números');
    }

    this.step2Service
      .enviarHandicap(handicap, timePlaying)
      .subscribe((rta) => console.log(rta));
    this.router.navigate(['/step3']);
    this.userService
      .getUserInfo()
      .subscribe((rta) => console.log('respuesta', rta));
  }
}
