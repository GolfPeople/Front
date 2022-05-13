import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() post: PostsResponse;

  commentary: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.post);
  }

  onClick() {
    this.modalCtrl.dismiss();
  }

  loadComments() {}
  comment() {}
}
