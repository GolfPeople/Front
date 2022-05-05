import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { Post, PostsResponse } from 'src/app/core/interfaces/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  avatarImage: string;
  userName: string;
  posts: PostsResponse[];
  location: string;
  des;

  constructor(private postsSvc: PostsService, private userSvc: UserService) {}

  ngOnInit() {
    this.userSvc.getUserInfo().subscribe((user) => {
      this.avatarImage = user.profile.photo;
      console.log(user.profile.photo);
      this.userName = user.name;
    });
    this.postsSvc.getPosts();
    this.postsSvc.posts$.subscribe((posts) => {
      this.posts = posts.reverse();
    });
  }
}
