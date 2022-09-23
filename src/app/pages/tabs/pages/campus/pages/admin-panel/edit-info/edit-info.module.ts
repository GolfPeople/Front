import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditInfoPageRoutingModule } from './edit-info-routing.module';

import { EditInfoPage } from './edit-info.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditInfoPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditInfoPage]
})
export class EditInfoPageModule {}
