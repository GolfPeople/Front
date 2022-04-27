import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { SecurityComponent } from './components/security/security.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    EditPage,
    PersonalInfoComponent,
    SecurityComponent,
    PrivacyComponent,
  ],
})
export class EditPageModule {}
