import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { debounceTime } from 'rxjs/operators';
import { FriendResponse } from '../models/friend.interface';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private http: HttpClient) {}

  search(user: string) {
    const params = new HttpParams().set('search', user);
    return this.http
      .get<FriendResponse>(`${URL}/connections/search`, { params })
  }
}
