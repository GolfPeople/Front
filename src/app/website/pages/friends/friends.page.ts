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
  public users$: Observable<Friend[]> = new Observable();
  public friends$: Observable<Friend[]> = new Observable();
  friendsData: boolean = false;
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
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
    });
    await loading.present();
    this.friendsSvc.following(this.friendsPage).subscribe(({ data }) => {
      this.friendsPage += 1;
      console.log('data de amigos', data);
      this.friends = data;
    });
    this.friendsSvc.mayKnow(this.mayKnowPage).subscribe(({ data }) => {
      this.mayKnowPage += 1;
      // console.log('data de quizas conozcas', data);
      this.mayKnow = data;
      loading.dismiss();
    });
  }

  search(value: string) {
    this.isLoading = true;
    console.log(value);
    if (value === '') {
      this.friendsData = false;
      this.isLoading = false;

      return;
    }
    this.friends$ = this.friendsSvc.searchFriend(value).pipe(
      debounceTime(500),
      map((data) => data.data),
      finalize(() => {
        this.friendsData = true;
        this.isLoading = false;
        //Esto es una prueba para ver la datar en consola. No se debe realizar.
        // this.users$.subscribe((res) => console.log('res--> ', res));
      })
    );
    this.users$ = this.friendsSvc.search(value).pipe(
      debounceTime(500),
      map((data) => data.data),
      finalize(() => {
        this.isLoading = false;
        //Esto es una prueba para ver la datar en consola. No se debe realizar.
        // this.users$.subscribe((res) => console.log('res--> ', res));
      })
    );
  }

  addedFriend(friend, index) {
    console.log(friend);
    console.log(index);
    // if (friend) {
    this.friendsSvc.following(this.friendsPage).subscribe(({ data }) => {
      this.friendsPage += 1;
      console.log('data de amigos', data);
      this.friends = data;
    });
    // }
    //Esto se va a utilizar si se requiere quitar
    // this.mayKnow.splice(index, 1);

    // No se puede hacer el push porque la data es distinta
    // this.friends.push(friend);
  }

  next() {
    this.swiper.swiperRef.slideNext(500);
    this.all = true;
    this.following = false;
    console.log(this.all, this.following);
  }
  prev() {
    this.swiper.swiperRef.slidePrev(500);
    this.all = false;
    this.following = true;
    console.log('all', this.all);
    console.log('following', this.following);
  }
}
