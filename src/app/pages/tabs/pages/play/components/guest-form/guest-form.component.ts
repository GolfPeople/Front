import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.scss'],
})
export class GuestFormComponent implements OnInit {

  name = new FormControl('', [Validators.required]);
  handicap = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email]);

  constructor() { }

  ngOnInit() {}

}
