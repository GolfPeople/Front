import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleOptionsComponent } from './toggle-options/toggle-options.component';
import { ActivityComponent } from './activity/activity.component';
import {SearchMessagesComponent} from './search-messages/search-messages.component';
import { SelectFriendComponent } from './select-friend/select-friend.component';
import { DateInputComponent } from './date-input/date-input.component';
import { DatepickerComponent } from './date-input/datepicker/datepicker.component';
import { StepperComponent } from './stepper/stepper.component';
import { TimeAgoPipe } from 'src/app/shared/pipes/time-ago.pipe';
import { AlertConfirmComponent } from './alert-confirm/alert-confirm.component';
import { GameItemComponent } from './game-item/game-item.component';
import { GolfCourseItemComponent } from './golf-course-item/golf-course-item.component';
import { PointsHitsModalComponent } from './points-hits-modal/points-hits-modal.component';
import { TenStarsRatingComponent } from './ten-stars-rating/ten-stars-rating.component';
import { UsersLoaderComponent } from './users-loader/users-loader.component';



@NgModule({
  exports: [
    ChatMessagesComponent, 
    HeaderComponent,   
    ToggleOptionsComponent,
    ActivityComponent,
    SearchMessagesComponent,
    SelectFriendComponent,
    DateInputComponent,
    DatepickerComponent,
    StepperComponent,
    TimeAgoPipe,
    AlertConfirmComponent,
    GameItemComponent,
    GolfCourseItemComponent,
    PointsHitsModalComponent,
    TenStarsRatingComponent,
    UsersLoaderComponent  
  ],
  declarations: [
    ChatMessagesComponent, 
    HeaderComponent,
    ToggleOptionsComponent,
    ActivityComponent,  
    SearchMessagesComponent,
    SelectFriendComponent,
    DateInputComponent,
    DatepickerComponent,
    StepperComponent,
    TimeAgoPipe,
    AlertConfirmComponent,
    GameItemComponent,
    GolfCourseItemComponent,
    PointsHitsModalComponent,
    TenStarsRatingComponent,
    UsersLoaderComponent  
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
