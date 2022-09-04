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
  handicapDecimal: string = '0';
  handicapValue: string = `${this.handicap}.${this.handicapDecimal}`;
  timePlaying: number = 0;
  isDisabled: boolean = false;

  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;
  isActive4: boolean;

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
    this.userService.getUserInfo().subscribe(({ profile }) => {
      if (profile.handicap) {
        this.handicapForm.controls['handicap'].setValue(profile.handicap);
      }
      if (profile.time_playing) {
        this.timePlaying = profile.time_playing;
        profile.time_playing === 1
          ? (this.isActive1 = true)
          : profile.time_playing === 2
          ? (this.isActive2 = true)
          : profile.time_playing === 3
          ? (this.isActive3 = true)
          : profile.time_playing === 4
          ? (this.isActive4 = true)
          : null;
      }
    });
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

  

  chooseTimePlaying(event) {
    const element = event.target;

    if (element.value == '1') {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = false;
      this.timePlaying = 1;
      return;
    }
    if (element.value == '2') {
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.isActive4 = false;
      this.timePlaying = 2;
      return;
    }
    if (element.value == '3') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.isActive4 = false;
      this.timePlaying = 3;
      return;
    }
    if (element.value == '4') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = true;
      this.timePlaying = 4;
      return;
    }
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
    this.step2Service.enviarHandicap(handicap, timePlaying).subscribe(
      (rta) => {
        console.log(rta);
        this.isLoading = false;
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
  }
}
