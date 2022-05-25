import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  searchItem: string = '';
  public data$: Observable<Friend[]> = new Observable();
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
      // console.log('data de amigos', data);
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
    console.log(this.searchItem);
    if (!value.length) {
      return;
    }
    this.data$ = this.friendsSvc.search(value).pipe(
      debounceTime(500),
      map((data) => data.data),
      finalize(() => {
        this.isLoading = false;
        //Esto es una prueba para ver la datar en consola. No se debe realizar.
        // this.data$.subscribe((res) => console.log('res--> ', res));
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
}
