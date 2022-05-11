/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const URL = 'https://www.api.app.golfpeople.com/api/auth/profile/1';

export interface UploadDataS1ResponseData {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class Step1Service {
  constructor(private http: HttpClient) {}

  uploadDataS1(image: Blob, license: string) {
    const formData = new FormData();
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        //     'Bearer': '{userToken}'
      }),
    };
    formData.append('photo', image);
    formData.append('license', license);
    return this.http.post<UploadDataS1ResponseData>(URL, formData);
  }
}
