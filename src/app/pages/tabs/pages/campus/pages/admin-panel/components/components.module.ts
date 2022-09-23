import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { SelectScheduleComponent } from './select-schedule/select-schedule.component';



@NgModule({
  exports: [
    HeaderAdminComponent, 
    SelectScheduleComponent,
  ],
  declarations: [
    HeaderAdminComponent, 
    SelectScheduleComponent,
  ],
  imports: [
    CommonModule, 
    IonicModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
