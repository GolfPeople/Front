import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-confirm',
  templateUrl: './alert-confirm.component.html',
  styleUrls: ['./alert-confirm.component.scss'],
})
export class AlertConfirmComponent implements OnInit {

 @Input() confirmText: string;
 @Input() content: string;
 @Input() inverseBtn: boolean;
  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  cancel(){
    this.modalController.dismiss();
  }

  confirm(){
    this.modalController.dismiss({confirm:true});
  }
}
