import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// latlng=40.714224,-73.961452&key=YOUR_API_KEY

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  //Geocoding Google maps

  geoCode() {
    // const location = 'Venezuela';
    // const params = {
    //   adress: location,
    //   key: 'AIzaSyCYXOtwSsEFgz7R14Y-ZKcyef-f-0Bs_s0',
    // };
    // this.http
    //   .get('https://maps.googleapis.com/maps/api/geocode/json', { params })
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
  }
}
