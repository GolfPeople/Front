import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameDetailPageRoutingModule } from './game-detail-routing.module';

import { GameDetailPage } from './game-detail.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameDetailPageRoutingModule,
    ComponentsModule,
    NgxQRCodeModule
  ],
  declarations: [GameDetailPage]
})
export class GameDetailPageModule {}
