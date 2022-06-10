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

  // Método para buscar usuarios
  search(user: string) {
    const params = new HttpParams().set('search', user);
    return this.http.get<FriendResponse>(`${URL}/connections/search`, {
      params,
    });
  }

  // Método para buscar amigos
  searchFriend(user: string) {
    const params = new HttpParams().set('search', user);
    return this.http.get<FriendResponse>(`${URL}/connections/search/friends`, {
      params,
    });
  }

  // Solicitud de amistad en caso de que el perfil sea privado
  friendRequest(id) {
    return this.http.post<FriendResponse>(`${URL}/connections/friends/attach/${id}`, {})
  }

  // Aceptar solicitud de amistad 
  acceptRequest(id){
    return this.http.post<FriendResponse>(`${URL}/connections/friends/accept/${id}`, {})
  }

  declineRequest(id){
    return this.http.post<FriendResponse>(`${URL}/connections/friends/delete/${id}`, {})
  }

  // Método para seguir a un usuario
  follow(id) {
    return this.http.post(`${URL}/connections/attach/${id}`, {});
  }

  // Método para dejar de seguir a un usuario
  unfollow(id) {
    return this.http.post(`${URL}/connections/detach/${id}`, {});
  }

  //Muestra los usuarios que sigo
  following(page) {
    const params = new HttpParams().set('page', page);

    return this.http.get<any>(`${URL}/connections/my/follows`);
  }

  //Muestra los usuarios que me siguen
  followers(page) {
    const params = new HttpParams().set('page', page);

    return this.http.get<FriendResponse>(`${URL}/connections/my/followers`);
  }

  mayKnow(page) {
    const params = new HttpParams().set('page', page);

    return this.http.get<FriendResponse>(`${URL}/connections/mayknow`);
  }
}
