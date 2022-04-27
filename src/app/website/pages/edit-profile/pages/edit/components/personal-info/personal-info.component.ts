import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalInfoService } from '../../services/personal-info/personal-info.service';
import { UserService } from '../../../../../../../core/services/user.service';
import { MyValidations } from 'src/app/utils/my-validations';
import { Country } from '../../../../../../../core/models/enums.interface';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  public form: FormGroup;
  id;
  gender;
  countries = Object.keys(Country);
  birthday: string;
  isActive1: boolean;
  7;
  isActive2: boolean;
  isActive3: boolean;

  timePlaying1;
  timePlaying2;
  timePlaying3;
  timePlaying4;
  timePlaying;

  type1;
  type2;
  type3;
  type4;
  type5;
  type;

  constructor(
    private fb: FormBuilder,
    private personalSvg: PersonalInfoService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = this.initForm();
    console.log('TEST -->', this.form.value);
    this.userService.getUserInfo().subscribe((res) => (this.id = res.id));
  }

  initForm(): FormGroup {
    return this.fb.group({
      name: ['', []],
      license: ['', []],
      email: ['', [Validators.email]],
      phone: ['', []],
      address: ['', []],
      province: ['', []],
      cp: ['', []],
      country: ['', []],
      language: ['', []],
      gender: [this.gender, []],
      birthday: [''],
      handicap: [null, [MyValidations.handicap]],
      timePlaying: [this.timePlaying, []],
      type: ['', []],
    });
  }

  getDate(date) {
    this.birthday = date;
    this.form.controls['birthday'].setValue(date);
  }

  chooseGender(event) {
    const element = event.target;
    if (element.value === '1') {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.gender = 1;
      this.form.controls['gender'].setValue(1);
      return;
    }
    if (element.value === '2') {
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.gender = 2;
      this.form.controls['gender'].setValue(2);

      return;
    }
    if (element.value === '3') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.gender = 3;
      this.form.controls['gender'].setValue(3);

      return;
    }
  }

  chooseTimePlaying(event) {
    const element = event.target;

    if (element.value == '1') {
      this.timePlaying1 = true;
      this.timePlaying2 = false;
      this.timePlaying3 = false;
      this.timePlaying4 = false;
      this.timePlaying = 1;
      this.form.controls['timePlaying'].setValue(1);
      return;
    }
    if (element.value == '2') {
      this.timePlaying1 = false;
      this.timePlaying2 = true;
      this.timePlaying3 = false;
      this.timePlaying4 = false;
      this.timePlaying = 2;
      this.form.controls['timePlaying'].setValue(2);

      return;
    }
    if (element.value == '3') {
      this.timePlaying1 = false;
      this.timePlaying2 = false;
      this.timePlaying3 = true;
      this.timePlaying4 = false;
      this.timePlaying = 3;
      this.form.controls['timePlaying'].setValue(3);

      return;
    }
    if (element.value == '4') {
      this.timePlaying1 = false;
      this.timePlaying2 = false;
      this.timePlaying3 = false;
      this.timePlaying4 = true;
      this.timePlaying = 4;
      this.form.controls['timePlaying'].setValue(4);

      return;
    }
  }

  onSubmit() {
    const dto = this.form.value;
    console.log(dto);
    this.personalSvg
      .updateInfo(dto, this.id)
      .subscribe((res) => console.log('RES -->', res));
  }

  chooseTypePlayer(event) {
    const element = event.target;

    if (element.value == '1') {
      this.type1 = true;
      this.type2 = false;
      this.type3 = false;
      this.type4 = false;
      this.type5 = false;
      this.type = 1;
      this.form.controls['type'].setValue(this.type);

      return;
    }
    if (element.value == '2') {
      this.type1 = false;
      this.type2 = true;
      this.type3 = false;
      this.type4 = false;
      this.type5 = false;
      this.type = 2;
      this.form.controls['type'].setValue(this.type);

      return;
    }
    if (element.value == '3') {
      this.type1 = false;
      this.type2 = false;
      this.type3 = true;
      this.type4 = false;
      this.type5 = false;
      this.type = 3;
      this.form.controls['type'].setValue(this.type);

      return;
    }
    if (element.value == '4') {
      this.type1 = false;
      this.type2 = false;
      this.type3 = false;
      this.type4 = true;
      this.type5 = false;
      this.type = 4;
      this.form.controls['type'].setValue(this.type);

      return;
    }
    if (element.value == '5') {
      this.type1 = false;
      this.type2 = false;
      this.type3 = false;
      this.type4 = false;
      this.type5 = true;
      this.type = 5;
      this.form.controls['type'].setValue(this.type);

      return;
    }
  }
}
