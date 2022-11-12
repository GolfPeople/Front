import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-points-hits-modal',
  templateUrl: './points-hits-modal.component.html',
  styleUrls: ['./points-hits-modal.component.scss'],
})
export class PointsHitsModalComponent implements OnInit {

 @Input() points;
 @Input() hits;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  cancel(){
    this.modalController.dismiss();
  }

  confirm(){
    this.modalController.dismiss({points: this.points, hits: this.hits});
  }

  validator(){
    if(!this.points){
      return false;
    }
    if(!this.hits){
      return false;
    }

    return true;
  }
}
