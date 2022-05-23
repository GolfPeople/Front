import { Component, OnInit } from '@angular/core';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  searchItem: string = '';
  public data$: any;
  isLoading: boolean = false;
  constructor(private friendsSvc: FriendsService) {}

  ngOnInit() {}

  search(value: string) {
    this.isLoading = true;
    console.log(this.searchItem);
    if (!value.length) {
      this.data$ = [];
      return;
    }
    this.data$ = this.friendsSvc.search(value).pipe(
      debounceTime(500),
      map((data) => data.data),
      finalize(() => (this.isLoading = false))
    );
  }
}
