import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post, PostsResponse } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class ReactionsService {
  constructor(private http: HttpClient) {}

  like(id) {
    return this.http.post(`${URL}/publish/toogle/like/${id}`, {});
  }

  getlikes(id) {
    return this.http.get(`${URL}/publish/show/like/${id}`);
  }
}
