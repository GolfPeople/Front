import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() backButton: any;
  @Input() backButtonModal: any;
  @Input() icon: string;
  constructor(private modalController: ModalController){ 
      }  
   

  ngOnInit() {}

  close(){
    this.modalController.dismiss();
  }

}
