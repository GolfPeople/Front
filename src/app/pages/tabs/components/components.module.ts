import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleOptionsComponent } from './toggle-options/toggle-options.component';
import { ActivityComponent } from './activity/activity.component';



@NgModule({
  exports: [
    ChatMessagesComponent, 
    HeaderComponent,   
    ToggleOptionsComponent,
    ActivityComponent
  ],
  declarations: [
    ChatMessagesComponent, 
    HeaderComponent,
    ToggleOptionsComponent,
    ActivityComponent
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
