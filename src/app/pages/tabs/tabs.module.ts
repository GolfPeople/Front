import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { TabsPage } from './tabs.page';
import { QrComponent } from './components/qr/qr.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { SuccessComponent } from './components/success/success.component';
import { PublicPostComponent } from './components/public-post/public-post.component';

import { SharedModule } from 'src/app/shared/shared.module';

const myComponents = [
  QrComponent,
  SuccessComponent,
  EditPostComponent,
  PublicPostComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    NgxQRCodeModule,
    ReactiveFormsModule,
    SharedModule,
    GooglePlaceModule,
  ],
  declarations: [TabsPage, myComponents],
})
export class TabsPageModule {}
