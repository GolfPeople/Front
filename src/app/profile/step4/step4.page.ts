import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.page.html',
  styleUrls: ['./step4.page.scss'],
})
export class Step4Page implements OnInit {
  public data;
  public otherCamps: any=[];

  constructor(public navCtrl: NavController){ }

  ngOnInit() {
  }

  goTo(){
    console.log('this.otherCamps', this.otherCamps);
   this.data=true;
  }

  add(){
   this.otherCamps.push({'camp':''});
  }

  remove(){
    this.otherCamps.pop();
  }

}
