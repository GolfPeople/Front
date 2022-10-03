import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

declare const google;

@Component({
  selector: 'app-reservation-detail-tournament',
  templateUrl: './reservation-detail-tournament.page.html',
  styleUrls: ['./reservation-detail-tournament.page.scss'],
})
export class ReservationDetailTournamentPage implements OnInit {

  @ViewChild('mapElement', { static: false }) mapElement;

  constructor(
  ) { }
  

  ngOnInit() {

  }

  
  ngAfterViewInit(): void {
    this.createMap();  
  }

  async createMap() {
    let latitude = '34.798730554262';
    let longitude = '126.9701314345';
    const map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 5,
        center: {lat: parseInt(latitude) , lng: parseInt(longitude)},
      }
    );

    new google.maps.Marker({
      position:{lat: parseInt(latitude) , lng: parseInt(longitude)},
      map,
      title: 'Map',
      icon: '../../../../../assets/img/marker-golfp.png'
    });
  }
 
}
