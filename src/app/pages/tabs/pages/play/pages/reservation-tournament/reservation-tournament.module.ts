import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationTournamentPageRoutingModule } from './reservation-tournament-routing.module';

import { ReservationTournamentPage } from './reservation-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationTournamentPageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [ReservationTournamentPage]
})
export class ReservationTournamentPageModule {}
