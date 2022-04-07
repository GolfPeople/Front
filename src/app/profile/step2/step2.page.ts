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
  nivelSelecionado: number= 4;
  handicap: string  = ''
  timePlaying: number = 0


  
  public experience: any;
  
  constructor(
    private step2Service:Step2Service,
    private userService:UserService,
    private router: Router
  ) {}
  
  ngOnInit() {}
  
  selecionarNivel(nivel: number) {
    this.nivelSelecionado = nivel;
    console.log('Nivel selecionado ',this.nivelSelecionado)
  }

  onSubmit() {
    const handicap = this.handicap;
    const timePlaying = this.timePlaying
    if ((handicap.length === 0 && timePlaying ===  0)) {
      return  window.alert('Los campos son abligatorios')
    }
    this.step2Service.enviarHandicap(handicap, timePlaying)
    .subscribe(rta => console.log(rta))
    this.router.navigate(['/step3'])
    this.userService.getUserInfo().subscribe(
      rta => console.log('respuesta',rta)
    )
  }

}
