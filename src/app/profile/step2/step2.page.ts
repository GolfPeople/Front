import { Component, OnInit } from '@angular/core';

import { Step2Service } from './step2.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MyValidations } from '../../utils/my-validations';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.page.html',
  styleUrls: ['./step2.page.scss'],
})
export class Step2Page implements OnInit {
  isLoading = false;
  nivelSelecionado: number = 4;
  handicap: string = '';
  handicapDecimal: string = '00';
  handicapValue: string = `${this.handicap}.${this.handicapDecimal}`;
  timePlaying: number = 0;
  isDisabled: boolean = false;

  public handicapForm: FormGroup;

  public experience: any;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private step2Service: Step2Service,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.handicapForm = this.initForm();
    console.log(this.handicapForm);
  }

  disabled() {
    this.handicapForm.controls.handicap.disable();
    this.isDisabled = true;
    this.handicapForm.controls['handicap'].setValue(null);
    console.log(this.handicapForm.value.handicap);
  }

  getHandicapValue(e) {
    const element = e.target.value;

    this.handicap = element;

    console.log(element);
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      handicap: [{ value: '', disabled: false }, [MyValidations.handicap]],
    });
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

  async onSubmit() {
    const timePlaying = this.timePlaying;
    const handicap = this.handicapForm.value.handicap;
    if (this.handicapForm.invalid) return;
    if (timePlaying === 0) window.alert('Debes selecionar una opción.');
    // if (handicap) {
    this.step2Service.enviarHandicap(handicap, timePlaying).subscribe(
      (rta) => {
        console.log(rta);
        this.isLoading = false;
        this.router.navigate(['/step3']);
      },
      (error) => {
        const code = error.message;
        let message = 'Datos incorrectos, intenta de nuevo.';
        if (code === 'Credenciales incorrectas') {
          message = 'Datos incorrectos, intenta de nuevo.';
        }
      }
    );
    setTimeout(() => {
      this.userService.getUserInfo().subscribe((rta) => console.log(rta));
    }, 3000);
    // } else {
    //   return window.alert('Los campos son obligatorios!');
    // }

    // const handicap = this.handicap;
    // const handicap = parseFloat(`${this.handicap}.${this.handicapDecimal}`);
    // console.log('el handicap es', handicap);
    // if (handicap === 0 && timePlaying === 0) {
    //   return window.alert('Los campos son abligatorios');
    // }
    // if (this.handicap.length > 2) {
    //   return window.alert('El handicap no puede ser mayor de 54');
    // }
    // if (this.handicapDecimal.length > 2) {
    //   return window.alert('El decimal no puede tener más e dos números');
    // }
  }
}
