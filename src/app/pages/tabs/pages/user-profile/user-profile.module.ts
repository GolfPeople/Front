import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { LevelComponent } from './components/level/level.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';

const components = [LevelComponent, QrModalComponent];

@NgModule({
  entryComponents: [QrModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    SharedModule,
    SwiperModule,
    NgxQRCodeModule,
  ],
  declarations: [UserProfilePage, components],
})
export class UserProfilePageModule {}
