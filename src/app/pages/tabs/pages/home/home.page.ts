import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';
import { GameService } from 'src/app/core/services/game.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { UserService } from '../../../../core/services/user.service';
import { CampusDataService } from '../campus/services/campus-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 
  
   userName: string = '';
    cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    posts: PostsResponse[] = [];
    page = 1;
    isLoadingMore: boolean = false;
    people: Friend[] = [];
    peoplePage = 1;
    notifications: Observable<any>;
    tournaments = [];

    loading: boolean;
    constructor(
      private userService: UserService,
      private postsSvc: PostsService,
      private modalCtrl: ModalController,
      private notificationsSvc: NotificationsService,
      private friendsSvc: FriendsService,
      private loadingCtrl: LoadingController,
      private cdr: ChangeDetectorRef,
      public campusSvg: CampusDataService,
      public gameSvc: GameService
    ) {
     
    }
  
    async ngOnInit() {
    
      this.userService.getUserInfo().subscribe((res) => {
        this.userName = res.name;
      });
      this.notificationsSvc.noReaedCount();
  
      this.friendsSvc.mayKnow(this.peoplePage).subscribe(({ data }) => {
        this.people = data;
      });
  
      this.postsSvc.all(this.page).subscribe(
        ({ data }) => {
          this.posts = data;
          this.page += 1;         
        },
        (error) => {   
          console.log(error);
        }
      );

      this.getGolfCourses();
      this.getTournaments();
    }
  
    ionViewDidEnter() {
      this.postsSvc.all(1).subscribe(
        ({ data }) => {
          this.posts = data;
          this.page = 2;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  
    getGolfCourses() {
     this.loading = true;
      this.campusSvg.getData().subscribe(async ({ data }) => {  
        this.campusSvg.golfCourses.next(data.reverse());   
        this.loading = false;        
        },
        (error) => {
          console.log('Error -->', error);
        }
      );
    }
    
    getTournaments() {   
      this.loading = true;
      this.gameSvc.getTournaments().subscribe(res => {    
        this.tournaments = res.data.reverse();  
        this.loading = false;      
      })
    }
  
    onLoadMore() {
      this.isLoadingMore = true;
      this.postsSvc.all(this.page).subscribe(
        ({ data }) => {
          this.posts = this.posts.concat(data);
          this.isLoadingMore = false;
          if (data.length) {
            this.page += 1;
          }
        },
        (error) => {
          this.isLoadingMore = false;
          console.log(error);
        }
      );
    }
  }
  
