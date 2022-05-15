import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Comment } from 'src/app/core/models/comment.interface';
import { CommentService } from 'src/app/core/services/comment.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserPublicData } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'app-comment-response',
  templateUrl: './comment-response.component.html',
  styleUrls: ['./comment-response.component.scss'],
})
export class CommentResponseComponent implements OnInit {
  @Input() commentary: Comment;
  @Input() postId: number;

  user: UserPublicData;
  date = new Date();

  description: string = '';

  constructor(
    private modalCtrl: ModalController,
    private commentSvc: CommentService,
    private postsSvc: PostsService,
    private userSvc: UserService
  ) {
    this.userSvc.user$.subscribe((res) => (this.user = res));
  }

  ngOnInit() {}

  respuesta() {
    const commentResponse = {
      user: this.user,
      created_at: this.date,
      description: this.description,
    };
    this.commentary.responses.push(commentResponse);
    const response = this.description;
    console.log(response);
    this.description = '';
    if (response === '') return;
    this.commentSvc.response(this.commentary.id, response).subscribe((res) => {
      console.log(res);
      this.postsSvc.getPostsAction();
      this.commentSvc.getComments(this.postId);
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
