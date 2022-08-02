import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CampusResponse } from 'src/app/core/models/campus.interface';
import { environment } from 'src/environments/environment';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class CampusDataService {

  golfCourses = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  getData() {
    // const params = new HttpParams().set('page', page);
    return this.http.get<any>(`${URL}/campus/show/all`);
  }

  sendReview(data){
    return this.http.post<any>(`${URL}/campus/reviews/create`,data)
  }

  savePics(data){

    let imageData = {
      hole: data.hole,
      images: data.images
    }
    
    return this.http.post<any>(`${URL}/campus/images/holes/${data.course_id}`,imageData)
  }

}
