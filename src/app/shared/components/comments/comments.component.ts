import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController } from '@ionic/angular';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { CommentService } from 'src/app/core/services/comment.service';

interface Comment {}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() post: PostsResponse;

  commentary: string = '';
  comments = [];

  constructor(
    private modalCtrl: ModalController,
    private FirebaseStorage: AngularFirestore,
    private commentSvc: CommentService,
    private loadingCtrl: LoadingController
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
      }
    });
  }

  async comment() {
    const commentary = this.commentary;
    console.log(commentary);
    this.commentary = '';
    this.commentSvc.comment(commentary, this.post.id).subscribe((res) => {
      console.log(res);
      this.loadComments();
    });
  }
}
