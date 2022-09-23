import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SearchMessagesComponent } from '../../../search-messages/search-messages.component';
import { OptionsPopoverComponent } from '../options-popover/options-popover.component';


interface Status{
  status: string,
  timestamp: string
}

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
})
export class UserHeaderComponent implements OnInit {

  @Input() user;
  @Input() chatId;
  status = {} as Status;
  presence$: any;
  constructor(
    private firebaseService: FirebaseService,
    private popoverController: PopoverController,
    private modalController: ModalController
    ) { }

  ngOnInit() {

    this.firebaseService.getDataById('status', (this.user.firebase_id ? this.user.firebase_id : this.user.provider_id)).valueChanges()
      .subscribe(data => {
        this.status.status = data['status'];
        this.status.timestamp = data['timestamp'].toDate();
      });

  }

  async searchMessagesModal() {
    const modal = await this.modalController.create({
    component: SearchMessagesComponent,
    cssClass: 'modal-full'
    });
   
    await modal.present();
   
   } 

  goToUserProfile() {
    this.firebaseService.routerLink('/tabs/user-profile/' + this.user.profile.id);
  }


  async options(ev: any) {
    const popover = await this.popoverController.create({
      component: OptionsPopoverComponent,
      event: ev,
      translucent: false,
      componentProps: {
        chatId: this.chatId,
        userId: this.user.profile.id
      }
    });
  
    await popover.present();
  }
}
