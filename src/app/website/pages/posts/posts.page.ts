import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { LoadingController } from '@ionic/angular';

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
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();

    this.actRoute.paramMap
      .pipe(
        switchMap((param) => {
          this.hashtag = param.get('hashtag');

          if (this.hashtag) {
            return this.postsSvc.getPostsByHashtag(this.hashtag);
          }
          return null;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.posts = res.filter((post) => post.files.length > 0).reverse();
        // this.posts = res.filter((item) => item.hashtags !== null);
        // console.log(this.posts);
        // const data = this.posts.map((item) => {
        //   const hashtags = item.hashtags;
        //   if (item.hashtags) {
        //     return { ...item, hashtags: hashtags };
        //   }
        // });
        // this.hashtagsPosts = data.filter((item) =>
        //   item.hashtags.includes(this.hashtag)
        // );

        console.log(this.hashtagsPosts);
        loading.dismiss();
      });

    // this.userSvc.getUserInfo().subscribe((user) => {
    //   this.avatarImage = user.profile.photo;
    //   this.userName = user.name;
    // });
  }

  goBack() {
    // this.router.navigate(['..']);
    this._location.back();
  }
}
