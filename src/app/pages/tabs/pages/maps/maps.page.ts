import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  @ViewChild('map') mapRef: ElementRef;
  map;

  constructor() { }

  ngOnInit() {
  }


 ionViewDidEnter() {
    this.createMap();
  }

  async createMap() {
     this.map = GoogleMap.create({
      id: 'map',
      apiKey: environment.mapsKey,      
      element: this.mapRef.nativeElement,
      forceCreate: true,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8,        
      } 
     })
  }
}
