import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPanelPageRoutingModule } from './admin-panel-routing.module';

import { AdminPanelPage } from './admin-panel.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPanelPageRoutingModule,
    ComponentsModule,
    TranslateModule
  ],
  declarations: [AdminPanelPage],
})
export class AdminPanelPageModule {}
