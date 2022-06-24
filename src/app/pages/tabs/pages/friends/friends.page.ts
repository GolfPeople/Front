import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';

// Swiper
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Lazy, Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FriendsPage implements OnInit {
  // Swiper
  @ViewChild('swiper') swiper: SwiperComponent;
  // Swiper navigation
  all: boolean = false;
  following: boolean = true;

  searchItem: string = '';
  public users$: Observable<Friend[]>;
  public friends$: Observable<Friend[]>;
  usersArray: Friend[];
  friendsArray: Friend[];
  friendsData: boolean = true;
  friends: any = [];
  mayKnow: Friend[] = [];
  friendsPage = 1;
  mayKnowPage = 1;
  isLoading: boolean = false;
  constructor(
    private friendsSvc: FriendsService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.search('');
  }

  search(value: string) {
    console.log('Buscando...');
    if (!this.isLoading) {
      this.isLoading = true;
    }
    this.friends$ = this.friendsSvc.searchFriend(value).pipe(
      map((data) => data.data),
      finalize(() => {
        this.friendsData = false;
      })
    );
    this.users$ = this.friendsSvc.search(value).pipe(
      map((data) => data.data),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  addedFriend(friend, index) {
    console.log(friend);
    console.log(index);
    this.friendsSvc.following(this.friendsPage).subscribe(({ data }) => {
      this.friendsPage += 1;
      console.log('data de amigos', data);
      this.friends = data;
    });
  }

  next() {
    this.swiper.swiperRef.slideNext(500);
    this.all = true;
    this.following = false;
    this.search(this.searchItem);
  }
  prev() {
    this.swiper.swiperRef.slidePrev(500);
    this.all = false;
    this.following = true;
    this.search(this.searchItem);
  }
}
