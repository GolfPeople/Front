import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController } from '@ionic/angular';
import {
  PostsResponse,
  UserPublicData,
} from 'src/app/core/interfaces/interfaces';
import { CommentService } from 'src/app/core/services/comment.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { CommentResponseComponent } from '../comment-response/comment-response.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() post: PostsResponse;

  commentary: string = '';
  comments = [];

  user: UserPublicData;
  userPhoto;
  createdAt = new Date();

  constructor(
    private modalCtrl: ModalController,
    private FirebaseStorage: AngularFirestore,
    private commentSvc: CommentService,
    private loadingCtrl: LoadingController,
    private postsSvc: PostsService,
    private userSvc: UserService
  ) {}

  async ngOnInit() {
    console.log(this.post);
    this.loadComments();
  }

  onClick() {
    this.modalCtrl.dismiss();
  }

  async loadComments() {
    const loading = await this.loadingCtrl.create({});
    await loading.present();

    this.commentSvc.getComments(this.post.id).subscribe((res) => {
      if (res.length) {
        this.comments = res;
        console.log(res);
        loading.dismiss();
        return;
      }
      loading.dismiss();
    });
  }

  async comment() {
    // const comment = {
    //   user: this.user,
    //   description: this.commentary,
    //   created_at: this.createdAt,
    //   responses: [],
    // };
    // this.comments.push(comment);
    const commentary = this.commentary;
    console.log(commentary);
    this.commentary = '';
    if (commentary === '') return;
    this.commentSvc.comment(commentary, this.post.id).subscribe((res) => {
      console.log(res);
      this.postsSvc.getPostsAction();
      this.loadComments();
    });
  }

  async presentModal(commentId, user, description) {
    const modal = await this.modalCtrl.create({
      component: CommentResponseComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        commentId,
        user,
        description,
      },
    });
    return await modal.present();
  }
}
