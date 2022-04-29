import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-save-info-modal',
  templateUrl: './save-info-modal.component.html',
  styleUrls: ['./save-info-modal.component.scss'],
})
export class SaveInfoModalComponent implements OnInit {
  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/website/profile']);
  }
}
