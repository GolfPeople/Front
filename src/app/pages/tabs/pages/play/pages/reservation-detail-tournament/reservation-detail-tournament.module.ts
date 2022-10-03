import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationDetailTournamentPageRoutingModule } from './reservation-detail-tournament-routing.module';

import { ReservationDetailTournamentPage } from './reservation-detail-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationDetailTournamentPageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [ReservationDetailTournamentPage]
})
export class ReservationDetailTournamentPageModule {}
