import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  avatarImage: string;
  userName: string;
  posts: PostsResponse[];
  hashtagsPosts: PostsResponse[] = [];
  location: string;

  productId: number;
  hashtag: string;

  constructor(
    private userSvc: UserService,
    private postsSvc: PostsService,
    private _location: Location,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.actRoute.paramMap
      .pipe(
        switchMap((param) => {
          this.hashtag = param.get('hashtag');

          if (this.hashtag) {
            return this.postsSvc.getPostsByHashtag();
          }
          return null;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.posts = res.filter((item) => item.hashtags !== null);
        console.log(this.posts);
        const data = this.posts.map((item) => {
          const hashtags = item.hashtags;
          if (item.hashtags) {
            return { ...item, hashtags: hashtags };
          }
        });
        this.hashtagsPosts = data.filter((item) =>
          item.hashtags.includes(this.hashtag)
        );
        console.log(this.hashtagsPosts);
      });

    this.userSvc.getUserInfo().subscribe((user) => {
      this.avatarImage = user.profile.photo;
      this.userName = user.name;
    });
  }

  goBack() {
    // this.router.navigate(['..']);
    this._location.back();
  }
}
