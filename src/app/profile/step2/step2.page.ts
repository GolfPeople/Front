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
  handicapDecimal: string = '00';
  handicapValue: string = `${this.handicap}.${this.handicapDecimal}`
  timePlaying: number = 0

  numberOptions = [
    {value: '1'},
    {value: '2'},
    {value: '3'},
    {value: '4'},
    {value: '5'},
    {value: '6'},
    {value: '7'},
    {value: '8'},
    {value: '9'},
    {value: '10'},
    {value: '11'},
    {value: '12'},
    {value: '13'},
    {value: '14'},
    {value: '15'},
    {value: '16'},
    {value: '17'},
    {value: '18'},
    {value: '19'},
    {value: '20'},
    {value: '21'},
    {value: '22'},
    {value: '23'},
    {value: '24'},
    {value: '25'},
    {value: '26'},
    {value: '27'},
    {value: '28'},
    {value: '29'},
    {value: '30'},
    {value: '31'},
    {value: '32'},
    {value: '33'},
    {value: '34'},
    {value: '35'},
    {value: '36'},
    {value: '37'},
    {value: '38'},
    {value: '39'},
    {value: '40'},
    {value: '41'},
    {value: '42'},
    {value: '43'},
    {value: '44'},
    {value: '45'},
    {value: '46'},
    {value: '47'},
    {value: '48'},
    {value: '49'},
    {value: '50'},
    {value: '51'},
    {value: '52'},
    {value: '53'},
    {value: '54'},
  ]

  decimalOptions = [
    {value: '00'},
    {value: '01'},
    {value: '02'},
    {value: '03'},
    {value: '04'},
    {value: '05'},
    {value: '06'},
    {value: '07'},
    {value: '08'},
    {value: '09'},
    {value: '10'},
    {value: '11'},
    {value: '12'},
    {value: '13'},
    {value: '14'},
    {value: '15'},
    {value: '16'},
    {value: '17'},
    {value: '18'},
    {value: '19'},
    {value: '20'},
    {value: '21'},
    {value: '22'},
    {value: '23'},
    {value: '24'},
    {value: '25'},
    {value: '26'},
    {value: '27'},
    {value: '28'},
    {value: '29'},
    {value: '30'},
    {value: '31'},
    {value: '32'},
    {value: '33'},
    {value: '34'},
    {value: '35'},
    {value: '36'},
    {value: '37'},
    {value: '38'},
    {value: '39'},
    {value: '40'},
    {value: '41'},
    {value: '42'},
    {value: '43'},
    {value: '44'},
    {value: '45'},
    {value: '46'},
    {value: '47'},
    {value: '48'},
    {value: '49'},
    {value: '50'},
    {value: '51'},
    {value: '52'},
    {value: '53'},
    {value: '54'},
    {value: '55'},
    {value: '56'},
    {value: '57'},
    {value: '58'},
    {value: '59'},
    {value: '60'},
    {value: '61'},
    {value: '62'},
    {value: '63'},
    {value: '64'},
    {value: '65'},
    {value: '66'},
    {value: '67'},
    {value: '68'},
    {value: '69'},
    {value: '70'},
    {value: '71'},
    {value: '72'},
    {value: '73'},
    {value: '74'},
    {value: '75'},
    {value: '76'},
    {value: '77'},
    {value: '78'},
    {value: '79'},
    {value: '80'},
    {value: '81'},
    {value: '82'},
    {value: '83'},
    {value: '84'},
    {value: '85'},
    {value: '86'},
    {value: '87'},
    {value: '88'},
    {value: '89'},
    {value: '90'},
    {value: '91'},
    {value: '92'},
    {value: '93'},
    {value: '94'},
    {value: '95'},
    {value: '96'},
    {value: '97'},
    {value: '98'},
    {value: '99'},
  ]


  
  public experience: any;
  
  constructor(
    private step2Service:Step2Service,
    private userService:UserService,
    private router: Router
  ) {}
  
  ngOnInit() {}

  getHandicapValue(e) {
    const element = e.target.value ;

    this.handicap = element

    console.log(element)
  }

  getDecimalValue(e) {
    const element = e.target.value ;

    this.handicapDecimal = element

    console.log(element)
  }
  
  selecionarNivel(nivel: number) {
    this.nivelSelecionado = nivel;
    console.log('Nivel selecionado ',this.nivelSelecionado)
  }

  onSubmit() {
    // const handicap = this.handicap;
    const timePlaying = this.timePlaying
    const handicap = parseFloat(`${this.handicap}.${this.handicapDecimal}`)
    console.log('el handicap es', handicap)
    if ((handicap === 0 && timePlaying ===  0)) {
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
