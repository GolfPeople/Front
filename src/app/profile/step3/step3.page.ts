import { Component, OnInit } from '@angular/core';

import {Step3Service} from './step3.service'
import {UserService} from '../../core/services/user.service'

@Component({
  selector: 'app-step3',
  templateUrl: './step3.page.html',
  styleUrls: ['./step3.page.scss'],
})
export class Step3Page implements OnInit {

  type: number = 0;

  constructor(private step3Service:Step3Service, private userService: UserService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.type === 0 ) {
      return window.alert('Tienes que selecionar un tipo de jugador')
    }
    this.step3Service.type(5).subscribe(
      rta => console.log(rta)
      )
  }

}
