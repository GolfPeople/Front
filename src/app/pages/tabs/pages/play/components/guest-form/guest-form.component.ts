import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.scss'],
})
export class GuestFormComponent implements OnInit {

  name = new FormControl('', [Validators.required]);
  handicap = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required]);
  @Input() playersLength: number;


  constructor(
    private modalController: ModalController,
    private firebaseSvc: FirebaseService
    ) { }

  ngOnInit() {}


close(){
  this.modalController.dismiss();
}  

addGuest(){

    let guest = {
      name: this.name.value,
      handicap: this.handicap.value,
      email: this.email.value
    }
    this.modalController.dismiss({guest})
  

}

  validator(){
    if(this.name.invalid){
      return false;
    }
    if(this.handicap.invalid){
      return false;
    }
    if(this.email.invalid){
      return false;
    }

    return true
  }
}
