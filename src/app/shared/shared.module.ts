import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDateComponent } from './select-date/select-date.component';

const exports = SelectDateComponent;

@NgModule({
  declarations: [SelectDateComponent],
  imports: [CommonModule],
  exports: [exports],
})
export class SharedModule {}
