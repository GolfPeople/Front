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
import { StockExchangeComponent } from './stock-exchange/stock-exchange.component';
import { ClubsComponent } from './clubs/clubs.component';
import { PointsHitsModalComponent } from './points-hits-modal/points-hits-modal.component';
import { TenStarsRatingComponent } from './ten-stars-rating/ten-stars-rating.component';
import { UsersLoaderComponent } from './users-loader/users-loader.component';
import { SelectGolfCourseComponent } from './select-golf-course/select-golf-course.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { GuestFormComponent } from '../pages/play/components/guest-form/guest-form.component';
import { PlayersGroupComponent } from '../pages/play/components/players-group/players-group.component';
import { PlayersGroupReadOnlyComponent } from '../pages/play/components/players-group-read-only/players-group-read-only.component';
import { PlayerOptionsComponent } from '../pages/play/components/player-options/player-options.component';
@NgModule({  
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    ChatMessagesComponent, 
    HeaderComponent,   
    ToggleOptionsComponent,
    ActivityComponent,
    SearchMessagesComponent,
    SelectFriendComponent,
    StockExchangeComponent,
    DateInputComponent,
    DatepickerComponent,
    StepperComponent,
    TimeAgoPipe,
    AlertConfirmComponent,
    GameItemComponent,
    GolfCourseItemComponent,
    StockExchangeComponent,
    ClubsComponent,
    PointsHitsModalComponent,
    TenStarsRatingComponent, 
    UsersLoaderComponent,
    SelectGolfCourseComponent,
    GuestFormComponent, 
    PlayersGroupComponent,
    PlayersGroupReadOnlyComponent,
    PlayerOptionsComponent
     
  ],
  declarations: [
    ChatMessagesComponent, 
    HeaderComponent,
    ToggleOptionsComponent,
    ActivityComponent,  
    StockExchangeComponent,
    SearchMessagesComponent,
    SelectFriendComponent,
    DateInputComponent,
    DatepickerComponent,
    StepperComponent,
    TimeAgoPipe, 
    AlertConfirmComponent,
    GameItemComponent,
    GolfCourseItemComponent,
    ClubsComponent ,
    PointsHitsModalComponent,
    TenStarsRatingComponent,
    UsersLoaderComponent,
    SelectGolfCourseComponent,  
    GuestFormComponent, 
    PlayersGroupComponent,
    PlayersGroupReadOnlyComponent,
    PlayerOptionsComponent
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    SharedModule,
    ReactiveFormsModule, 
    SwiperModule
  ]
})
export class ComponentsModule { }
