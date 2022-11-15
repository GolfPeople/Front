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
import { SaveInfoModalComponent } from './pages/edit/components/save-info-modal/save-info-modal.component';
import { ErrorAlertComponent } from './pages/edit/components/error-alert/error-alert.component';
import { ComponentsModule } from '../../components/components.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  entryComponents: [
    QrModalComponent,
    ErrorAlertComponent,
    SaveInfoModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule, 
    IonicModule,
    RouterModule,
    NgxQRCodeModule,
    NgChartsModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    SwiperModule
  ],

  declarations: [
    EditProfilePage,
    QrModalComponent,
    SaveInfoModalComponent,
    LevelComponent,
    ErrorAlertComponent,
  ],
})
export class EditProfilePageModule {}
