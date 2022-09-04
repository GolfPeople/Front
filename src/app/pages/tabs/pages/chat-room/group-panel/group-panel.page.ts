import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertConfirmComponent } from '../../../components/alert-confirm/alert-confirm.component';
import { SearchMessagesComponent } from '../search-messages/search-messages.component';
import { NewMemberComponent } from './new-member/new-member.component';

@Component({
  selector: 'app-group-panel',
  templateUrl: './group-panel.page.html',
  styleUrls: ['./group-panel.page.scss'],
})
export class GroupPanelPage implements OnInit {
  date = Date.now()
  data;
  id;
  loading: boolean;

  updateName: boolean;

  isAdmin: boolean;
  user_id;

  constructor(
    public chatSvc: ChatService,
    private actRoute: ActivatedRoute,
    private modalController: ModalController,
    private firebaseSvc: FirebaseService
  ) {
    this.id = parseInt(this.actRoute.snapshot.paramMap.get('id'));
  }



  ngOnInit() {
  }

  async searchMessagesModal() {
    const modal = await this.modalController.create({
    component: SearchMessagesComponent,
    cssClass: 'modal-full'
    });
   
    await modal.present();
   
   } 


  ionViewWillEnter() {
    this.user_id = JSON.parse(localStorage.getItem('user_id'))
    this.getChatRoom();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  getChatRoom() {
    
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      this.data = rooms.filter(res => res.id == this.id)[0];
      this.data.user = this.data.user.map(u => {
        return {
          name: u.name,
          profile: u.profile,
          isAdmin: (u.pivot.admin == 1 && this.user_id ? true : false),
          pivot: u.pivot
        }
      })

      this.isAdmin = (this.data.user.filter(u => u.profile.id == this.user_id && u.pivot.admin == 1)[0] ? true : false)

    });
  }


  async addImage() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      promptLabelHeader: 'Imagen',
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
      source: CameraSource.Prompt
    });
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.data.image = await this.firebaseSvc.uploadPhoto('group/' + this.id, image.dataUrl);
    loading.dismiss();

    this.updateGroup();
  }

  async newMembers() {
    const modal = await this.modalController.create({
      component: NewMemberComponent,
      cssClass: 'fullscreen-modal',
      componentProps: { currentMembers: this.data.user.map(u => { return (u.profile.id) }).filter(id => { return id !== JSON.parse(localStorage.getItem('user_id')) }) }
    });

    modal.present();

     
    const { data } = await modal.onWillDismiss();
    if (data) {
      data.members.map(m => {
        this.data.user.push(m);
      });

      this.updateGroup();
    }
  }

  /**
 *=================== Eliminar grupo========================
 * @param id 
 */
  async confirmDelete() {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Eliminar',
        content: '¿Quieres eliminar este grupo?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.deleteGroup();
    }
  }

  /**
  *===================Salir del grupo========================
  * @param id 
  */
  async confirmOutOfGroup() {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Salir',
        content: '¿Quieres salir de este grupo?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
     this.outOfGroup();
    }
  }


  async outOfGroup() {
    let data = {
      user_id: JSON.parse(localStorage.getItem('user_id'))
    }

    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.chatSvc.outOfGroup(this.id, data).subscribe(res => {    
      this.firebaseSvc.Toast('Haz salido del grupo');
      this.firebaseSvc.routerLink('/tabs/chat-room')
      loading.dismiss();
    }, error => {
      console.log(error);
      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }


  /**
   *===================Eliminar miembro========================
   * @param id 
   */
  async confirmDeleteMember(index, user_id) {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Eliminar',
        content: '¿Quieres eliminar a este miembro?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {

      let user = {
        user_id: user_id
      }

      const loading = await this.firebaseSvc.loader().create();
      await loading.present();
      this.chatSvc.outOfGroup(this.id, user).subscribe(res => {  
        this.data.user.splice(index, 1);  
        this.firebaseSvc.Toast('Miembro eliminado'); 
        loading.dismiss();
      }, error => {
        console.log(error);
        this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
        loading.dismiss();
      })
    }
  }

  async deleteGroup() {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.chatSvc.deleteGroup(this.id).subscribe(res => {
      this.firebaseSvc.routerLink('tabs/chat-room')
      this.firebaseSvc.Toast('Grupo eliminado exitosamente')
      loading.dismiss();
    }, error => {
      console.log(error);
      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }

  async updateGroup() {
    let data = {
      users: this.data.user.map(u => { return (u.profile.id) }).filter(id => { return id !== JSON.parse(localStorage.getItem('user_id')) }),
      name: this.data.name_chat,
      image: this.data.image
    }

    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.chatSvc.updateGroup(this.id, data).subscribe(res => {
      this.getChatRoom();
      this.updateName = false;
      this.firebaseSvc.Toast('Actualizado exitosamente')
      loading.dismiss();
    }, error => {
      console.log(error);
      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }
}
