import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartTournamentPageRoutingModule } from './start-tournament-routing.module';

import { StartTournamentPage } from './start-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartTournamentPageRoutingModule,
    ComponentsModule
  ],
  declarations: [StartTournamentPage]
})
export class StartTournamentPageModule {}
