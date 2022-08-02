import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HoleDetailPageRoutingModule } from './hole-detail-routing.module';

import { HoleDetailPage } from './hole-detail.page';
import { SwiperModule } from 'swiper/angular';

import { CommentsComponent } from './components/comments/comments.component';
import { InfoComponent } from './components/info/info.component';
import { PicsComponent } from './components/pics/pics.component';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HoleDetailPageRoutingModule,
    SwiperModule,
    ComponentsModule
  ],
  declarations: [HoleDetailPage, CommentsComponent,InfoComponent,PicsComponent]
})
export class HoleDetailPageModule {}
