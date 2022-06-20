import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent implements OnInit {
  @Input() message;
  @Input() route;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/profile']);
  }
}
