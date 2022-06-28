import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import {
  PostsResponse,
  UserPublicData,
} from 'src/app/core/interfaces/interfaces';
import { CommentService } from 'src/app/core/services/comment.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { CommentResponseComponent } from 'src/app/shared/components/comment-response/comment-response.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  postId: any;
  post: PostsResponse;

  commentary: string = '';
  comments = [];

  user: UserPublicData;
  userPhoto;
  date = new Date();

  constructor(
    private modalCtrl: ModalController,
    private commentSvc: CommentService,
    private loadingCtrl: LoadingController,
    private postsSvc: PostsService,
    private userSvc: UserService,
    private actRoute: ActivatedRoute,
    private location: Location
  ) {
    this.userSvc.user$.subscribe((res) => (this.user = res));
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();

    this.actRoute.paramMap
      .pipe(
        switchMap((param) => {
          this.postId = param.get('postId');
          if (this.postId) {
            return this.postsSvc.getPost(this.postId);
          }
          // loading.dismiss();
          return null;
        })
      )
      .subscribe((post) => {
        this.post = post;
        console.log('Publicacion recibida', this.post);
        this.commentSvc.getComments(post.id).subscribe(
          (comments) => {
            if (comments.length) {
              this.comments = comments;
              console.log(comments);
              loading.dismiss();
              return;
            }
            loading.dismiss();
          },
          (error) => {
            loading.dismiss();
            throw new Error(`Error --> ${error}`);
          }
        );
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  goBack() {
    this.location.back();
  }

  loadComments() {
    this.commentSvc.getComments(this.post.id).subscribe(
      (res) => {
        if (res.length) {
          this.comments = res;
          return;
        }
      },
      (error) => {
        console.log('Error --> ', error);
      }
    );
  }

  async comment() {
    const comment = {
      user: this.user,
      description: this.commentary,
      created_at: this.date,
      responses: [],
    };
    this.comments.push(comment);
    const commentary = this.commentary;
    console.log(commentary);
    this.commentary = '';
    if (commentary === '') return;
    this.commentSvc.comment(commentary, this.post.id).subscribe((res) => {
      console.log(res);
      this.post.comments.length += 1;
      this.postsSvc.getPostsAction();
      this.loadComments();
    });
  }

  async createResponse(commentary: Comment) {
    const modal = await this.modalCtrl.create({
      component: CommentResponseComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        commentary,
        postId: this.post.id,
      },
    });
    return await modal.present();
  }
}
