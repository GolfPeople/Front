import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
})
export class OptionsPopoverComponent implements OnInit {

@Input() chatId;
@Input() userId;

  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    private firebaseSvc: FirebaseService,
    public chatSvc: ChatService
    ) { }

  ngOnInit() {}

  goToUserProfile() {
    this.firebaseSvc.routerLink('/tabs/user-profile/' + this.userId);
    this.popoverController.dismiss();
  }

  async confirmDelete() {
    this.popoverController.dismiss();
   
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Eliminar',
        content: '¿Quieres eliminar este chat?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.deleteChat();
    }
  }

  async deleteChat() {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.chatSvc.deleteGroup(this.chatId).subscribe(res => {
      this.firebaseSvc.routerLink('tabs/chat-room')
      this.firebaseSvc.Toast('Chat eliminado exitosamente')
      loading.dismiss();
    }, error => {
      console.log(error);
      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }

}
