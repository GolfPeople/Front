import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayPageRoutingModule } from './play-routing.module';

import { PlayPage } from './play.page';
import { ComponentsModule } from '../../components/components.module';
import { SwiperModule } from 'swiper/angular';
import { GamesComponent } from './components/games/games.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayPageRoutingModule,
    ComponentsModule,
    SwiperModule  
  ],
  declarations: [PlayPage, GamesComponent, TournamentsComponent]
})
export class PlayPageModule {}
