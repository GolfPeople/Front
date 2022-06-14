import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  geocoder = new google.maps.Geocoder();

  constructor(private http: HttpClient) {}

  // Método para obtener las coordenadas del usuario
  async currentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
    return coordinates;
  }

  // Este método devuelve la dirección del usuario
  async geoCodeLatLong(latlng): Promise<string> {
    let address;
    console.log('TEST LAt Long', latlng);
    await this.geocoder.geocode(
      { location: latlng },
      function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          alert(status);
        }
        if (status == google.maps.GeocoderStatus.OK) {
          address = `${results[0].address_components[3].long_name} ${results[0].address_components[6].long_name}`;
          console.log('Tu ubucación -->', address);
        }
      }
    );
    console.log(address);
    return address;
  }
}
