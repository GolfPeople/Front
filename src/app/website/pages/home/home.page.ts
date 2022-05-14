import { Component, OnInit } from '@angular/core';
import { take, takeLast } from 'rxjs/operators';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string = '';
  cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  posts: PostsResponse[];

  constructor(
    private userService: UserService,
    private postsSvc: PostsService
  ) {
    this.userService.user$.subscribe((data) => {
      this.userName = data.name;
    });
    this.postsSvc.posts$.subscribe((data) => {
      this.posts = data.slice(0, 3);
    });
    console.log(this.posts);
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
    });
  }
}
