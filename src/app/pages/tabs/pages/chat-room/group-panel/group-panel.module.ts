import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupPanelPageRoutingModule } from './group-panel-routing.module';

import { GroupPanelPage } from './group-panel.page';
import { ComponentsModule } from '../../../components/components.module';
import { NewMemberComponent } from './new-member/new-member.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPanelPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GroupPanelPage, NewMemberComponent]
})
export class GroupPanelPageModule {}
