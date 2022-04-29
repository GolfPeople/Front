import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  @Input() message;
  constructor(private modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {}

  closeAlert() {
    this.modalCtrl.dismiss();
  }
}
