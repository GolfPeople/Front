import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTournamentPageRoutingModule } from './create-tournament-routing.module';

import { CreateTournamentPage } from './create-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTournamentPageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [CreateTournamentPage]
})
export class CreateTournamentPageModule {}
