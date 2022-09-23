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

  updateGolfCourse(id, data){
    return this.http.post<any>(`${URL}/campus/edit/${id}`,data)
  }

  getCourseGames(id){
    return this.http.get<any>(`${URL}/games/course/${id}`);
  }


  deleteGolfPhoto(id){
    return this.http.post<any>(`${URL}/campus/delete/images/holes/${id}`,{})
  }

  saveGeneralReview(course_id, data){
    return this.http.post<any>(`${URL}/campus/ratings/${course_id}`, data);
  }
 
  searchCourses(name: string) {
    const params = new HttpParams().set('search', name);
    return this.http.get<any>(`${URL}/campus/search`, {
      params,
    });
  }

  likeToHole(course_id, hole){
 
    return this.http.post<any>(`${URL}/campus/toogle/like/${course_id}`, { hole: hole.value });
  }

  getHoleLikes(course_id, hole){
    return this.http.get<any>(`${URL}/campus/show/like/${course_id}/${hole.value}`);
  }

  getPlayerCourses(user_id){
    return this.http.get<any>(`${URL}/auth/courses/${user_id}`);
  }
}
