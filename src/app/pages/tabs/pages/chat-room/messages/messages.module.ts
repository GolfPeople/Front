import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import { ComponentsModule } from '../../../components/components.module';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { OptionsPopoverComponent } from './components/options-popover/options-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [MessagesPage, UserHeaderComponent, OptionsPopoverComponent]
})
export class MessagesPageModule {}
