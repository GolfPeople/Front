import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

import { UserService } from 'src/app/core/services/user.service';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { Step6Service } from './step6.service';
import { FormControl, Validators } from '@angular/forms';

declare var google;

@Component({
  selector: 'app-step6',
  templateUrl: './step6.page.html',
  styleUrls: ['./step6.page.scss'],
})
export class Step6Page implements OnInit, AfterViewInit {
  autocomplete: any;

  gender;
  birthday: string;
  address: FormControl;
  coords = { lat: 40.731, lng: -73.997 };

  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;

  geocoder = new google.maps.Geocoder();
  // autocomplete = new google.maps.places.Autocomplete();

  title = 'google-places-autocomplete';
  userAddress: string = '';
  userLatitude: string = '';
  userLongitude: string = '';

  constructor(
    private Step6Svc: Step6Service,
    private userService: UserService,
    private geolocationService: GeolocationService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.initAutoComplete();
  }

  async ngOnInit() {
    this.address = this.initFormcontrol();
    // await this.printCurrentPosition();
    const coordinates = await this.geolocationService.currentPosition();
    const { latitude, longitude } = await coordinates.coords;
    this.coords = { lat: latitude, lng: longitude };

    this.geoCodeLatLong(this.coords);

    console.log(this.address.value);
    this.userService.getUserInfo().subscribe(({ profile }) => {
      if (profile.gender) {
        this.gender = profile.gender;
        if (profile.gender === 1) {
          this.isActive1 = true;
        }
        if (profile.gender === 2) {
          this.isActive2 = true;
        }
        if (profile.gender === 3) {
          this.isActive3 = true;
        }
      }
      if (profile.birthday) {
        this.birthday = profile.birthday;
      }
      if (profile.address) {
        this.address.setValue(profile.address);
      }
    });
  }

  initFormcontrol() {
    const control = new FormControl('', {});
    return control;
  }

  // async printCurrentPosition() {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   const { latitude, longitude } = coordinates.coords;

  //   this.coords = { lat: latitude, lng: longitude };

  //   console.log('Coords', this.coords);
  //   console.log('Current position:', coordinates);
  //   return coordinates;
  // }

  chooseGender(event) {
    const element = event.target;
    if (element.value === '1') {
      this.isActive1 = true;
      this.isActive2 = false;
      this.isActive3 = false;
      this.gender = 1;
      return;
    }
    if (element.value === '2') {
      this.isActive1 = false;
      this.isActive2 = true;
      this.isActive3 = false;
      this.gender = 2;
      return;
    }
    if (element.value === '3') {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = true;
      this.gender = 3;
      return;
    }
  }

  getDate(date: string) {
    if (date === '0000-00-00') {
      return;
    } else {
      this.birthday = date;
    }
  }

  resetInput() {
    this.address.reset();
  }

  onSubmit() {
    this.geoCodeLatLong(this.coords);
    // this.codeAddress();
    this.Step6Svc.dateAndLocation(
      this.birthday,
      this.gender,
      this.userAddress
    ).subscribe((res) => {
      console.log(res);
      // this.router.navigate(['/step2']);
    });
    setTimeout(() => {
      this.userService.getUserInfo().subscribe((rta) => console.log(rta));
    }, 3000);
  }

  showValue() {
    console.log(this.address.value);
  }

  initAutoComplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('input-step6') as HTMLInputElement,
      {
        // types: ['establishment'],
        // componentRestrictions: { country: ['ES'] },
        fields: ['place_id', 'geometry', 'name'],
      }
    );

    // this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  }

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
  }

  codeAddress() {
    // var input = document.getElementById("address");
    // var autocomplete = new google.maps.places.Autocomplete(this.address.value);
    // var address = document.getElementById("address").value;
    var address = this.address.value;
    this.geocoder.geocode({ address: address }, function (r, s) {
      console.log(r);
      alert(r[0].geometry.location);
    });
  }

  geoCodeLatLong(latlng) {
    // This is making the Geocode request
    const address = this.address;
    console.log('TEST LAt Long', latlng);
    this.geocoder.geocode({ location: latlng }, function (results, status) {
      console.log('TEST results', results);
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        // var address = results[0].formatted_address;

        //This is placing the returned address in the 'Address' field on the HTML form

        address.setValue(
          `${results[0].address_components[3].long_name} ${results[0].address_components[6].long_name}`
        );
        console.log(address.value);
      }
    });
    this.address.setValue(address.value);
  }
}
