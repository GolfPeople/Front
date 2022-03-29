/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UploadDataS1ResponseData{
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class Step1Service {

  constructor(private http: HttpClient) { }

  uploadDataS1(image: string, licence: string, userToken: string){
    const opts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
   //     'Bearer': '{userToken}'
      })
    };
    return this.http.post<UploadDataS1ResponseData>(
      'https://www.api.app.golfpeople.com/api/auth/profile/1',
      {image, licence},
      opts
    );
  }
}
