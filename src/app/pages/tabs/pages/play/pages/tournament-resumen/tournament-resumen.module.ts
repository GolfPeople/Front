import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TournamentResumenPageRoutingModule } from './tournament-resumen-routing.module';

import { TournamentResumenPage } from './tournament-resumen.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TournamentResumenPageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [TournamentResumenPage]
})
export class TournamentResumenPageModule {}
