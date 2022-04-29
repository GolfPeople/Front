import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  @Input() message;
  @Input() route;

  constructor(private modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {}

  closeAlert(route: string) {
    this.modalCtrl.dismiss();
    if (route === '') return;
    this.router.navigate([route]);
    console.log(route);
  }
}
