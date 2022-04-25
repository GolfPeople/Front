import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterLinkActive } from '@angular/router';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { LevelComponent } from './pages/level/level.component';
import { NgChartsModule } from 'ng2-charts';





@NgModule({
  entryComponents: [QrModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule,
    SharedModule,
    IonicModule,
    RouterModule,
    NgxQRCodeModule,
    NgChartsModule,
    ReactiveFormsModule,
    SharedModule
  ],
    
    declarations: [EditProfilePage, QrModalComponent, LevelComponent],
})
export class EditProfilePageModule {}
