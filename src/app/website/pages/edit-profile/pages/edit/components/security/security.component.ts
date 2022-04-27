import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { PersonalInfoService } from '../../services/personal-info/personal-info.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  public form: FormGroup;
  id;

  constructor(
    private fb: FormBuilder,
    private personalSvg: PersonalInfoService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = this.initForm();

    this.userService.getUserInfo().subscribe((res) => (this.id = res.id));
  }

  initForm(): FormGroup {
    return this.fb.group({
      actualPassword: ['', [Validators.email]],
      newPassword: ['', [Validators.email]],
      repeatPasword: ['', [Validators.email]],
    });
  }

  onSubmit() {
    const dto = this.form.value;
    console.log(dto);
    this.personalSvg
      .updatePassword(dto, this.id)
      .subscribe((res) => console.log('RES -->', res));
  }
}
