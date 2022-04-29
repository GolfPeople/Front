import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  @Input() message;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/website']);
  }
}
