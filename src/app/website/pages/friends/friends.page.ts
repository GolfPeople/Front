import { Component, OnInit } from '@angular/core';
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
  isLoading: boolean = false;
  constructor(private friendsSvc: FriendsService) {}

  ngOnInit() {}

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
      })
    );
  }
}
