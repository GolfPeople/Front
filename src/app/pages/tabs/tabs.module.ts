import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';


import { TabsPage } from './tabs.page';
import { QrComponent } from './components/qr/qr.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { SuccessComponent } from './components/success/success.component';

const myComponents = [
  QrComponent,
  SuccessComponent,
  EditPostComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    NgxQRCodeModule,
    ReactiveFormsModule
  ],
  declarations: [TabsPage, myComponents]
})
export class TabsPageModule {}
