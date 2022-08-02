import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
declare const google;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, AfterViewInit {

  @Input() average;
  @Input() detail; 
  @Input() reviews; 
  levelRange = 3;

  features = [
    {id: '1', name: 'Buggy', icon: '../../../../../../../../../assets/icons/buggy.svg'},
    {id: '2', name: 'Hoyos', icon: '../../../../../../../../../assets/icons/golf-ball.svg'},
    {id: '3', name: 'Tienda', icon: '../../../../../../../../../assets/icons/shirt.svg'},
  ]

  @ViewChild('mapElement', { static: false }) mapElement;
  constructor(
    private firebaseSvc: FirebaseService,
    ) { }

  ngOnInit() {
        
  }

  ngAfterViewInit(): void {
    this.createMap();
  }

  goToAdminRequest(){      
    this.firebaseSvc.routerLink('/tabs/campus/admin-request/'+btoa(JSON.stringify(this.detail)))
  }

  async createMap() {
 
    const map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 5,
        center: {lat: parseInt(this.detail.latitude) , lng: parseInt(this.detail.longitude)},
      }
    );

    new google.maps.Marker({
      position:{lat: parseInt(this.detail.latitude) , lng: parseInt(this.detail.longitude)},
      map,
      title: this.detail.courseName,
      icon: '../../../../../assets/img/marker-golfp.png'
    });
  }

}
