import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Campus } from 'src/app/core/models/campus.interface';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { UserService } from 'src/app/core/services/user.service';
import { CampusDataService } from './services/campus-data.service';

declare var google: any;

@Component({
  selector: 'app-campus',
  templateUrl: './campus.page.html',
  styleUrls: ['./campus.page.scss'],
})
export class CampusPage implements OnInit {
  geocoder = new google.maps.Geocoder();

  campos: Campus[] = [];
  searchedCampos: Campus[] = [];
  page = 1;
  text: string = '';
  myAddress: string = '';

  coords;

  constructor(
    private loadingCtrl: LoadingController,
    private campusSvg: CampusDataService,
    private geolocationSvc: GeolocationService,
    private userSvc: UserService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({ cssClass: 'loading-ctrl' });
    await loading.present();
    // const coordinates = await this.geolocationSvc.currentPosition();
    // const { latitude, longitude } = await coordinates.coords;
    // this.coords = { lat: latitude, lng: longitude };
    // this.geoCodeLatLong(this.coords);

    this.userSvc.getUserInfo().subscribe((user) => {
      console.log(user);
      // this.text = user.profile.address;
    });

    this.campusSvg.getData(this.page).subscribe(
      ({ data }) => {
        this.campos = data.reverse();
        this.searchedCampos = this.campos;
        // this.searchCampo(this.text);
        console.log(data);
        this.page += 1;
        loading.dismiss();
      },
      (error) => {
        console.log('Error -->', error);
        loading.dismiss();
      }
    );
  }

  clearInput() {
    this.text = '';
    this.searchCampo(this.text);
  }

  searchCampo(value) {
    console.log(value);
    if (!(value.length >= 1)) {
      this.searchedCampos = this.campos;
    } else {
      this.searchedCampos = this.campos.filter((campo) => {
        const designer = JSON.parse(campo.designer);

        return designer.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    }
  }

  async geoCodeLatLong(latlng) {
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
    this.text = address;
  }
}
