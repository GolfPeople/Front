import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolesPageRoutingModule } from './holes-routing.module';

import { HolesPage } from './holes.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { SwiperModule } from 'swiper/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolesPageRoutingModule,
     ComponentsModule,
    TranslateModule,
    SwiperModule
  ],
  declarations: [HolesPage]
})
export class HolesPageModule {}
