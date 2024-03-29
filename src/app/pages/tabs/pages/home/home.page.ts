import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';
import { GameService } from 'src/app/core/services/game.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from '../../../../core/services/user.service';
import { CampusDataService } from '../campus/services/campus-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userName: string = '';
  posts: PostsResponse[] = [];
  page = 1;
  isLoadingMore: boolean = false;
  people: Friend[] = [];
  peoplePage = 1;
  notifications: Observable<any>;
  tournaments = [];

  loading: boolean;

  resfresh: BehaviorSubject<string>;

  constructor(
    private userService: UserService,
    private postsSvc: PostsService,
    private friendsSvc: FriendsService,
    public campusSvg: CampusDataService,
    public gameSvc: GameService,

  ) {

   
  }

  async ngOnInit() {
    this.getGolfCourses();
    this.resfresh = this.userService.refreshPost;
  }

  ionViewWillEnter() {
    this.getUserInfo();
    this.getPostPageOne();
    this.getTournaments();
    this.getPeopleUserMayKnow();
  }

  ionViewDidEnter() {
    this.getPostPageOne();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getGolfCourses();
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }


  getPeopleUserMayKnow() {
    this.friendsSvc.mayKnow(this.peoplePage).subscribe(({ data }) => {
      this.people = data;
    });
  }

  getPostPageOne() {
    this.postsSvc.all(1).subscribe(
      ({ data }) => {

        this.posts = data;

        this.page += 1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadMorePost() {

    this.postsSvc.all(this.page).subscribe(
      ({ data }) => {

        this.posts.push(...data);
        this.page += 1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
      this.userService.user.next(res);
      this.userService.userPhoto.next(res.profile.photo);
    });
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

