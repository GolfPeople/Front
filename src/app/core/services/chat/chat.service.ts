import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';
import { Message, User } from '../../models/chat.interface';

const API = `${environment.golfpeopleAPI}/api`

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // currentUser: User = null

  rooms$ = new BehaviorSubject([]);
  friends$ = new BehaviorSubject([]);
  unread$ = new BehaviorSubject(false);
  unreadActivity$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService
  ) { }

  // Mensaje nuevo
  sendMessage(id, data) {
    return this.http.post(`${API}/chat/new/${id}`, data)
  }

  // Mis salas de chat
  getRoom() {
    return this.http.get(`${API}/chat/connect`)
  }

  // Sala de chat, donde id es el id de la sala
  getChatMessages(id) {
    return this.http.get<any>(`${API}/chat/${id}`)
  }


  createChatRoom(data) { 
    return this.http.post<any>(`${API}${environment.createChatRoom}`,  data )
  }


  deleteGroup(id) { 
    return this.http.post<any>(`${API}/chat/delete/room/${id}`,  {})
  }

  updateGroup(id, data){
    return this.http.post<any>(`${API}/chat/edit/room/${id}`, data)
  }
 
  outOfGroup(id, data){
    return this.http.post<any>(`${API}/chat/delete/user/room/${id}`, data)
  }

  search(text) {
    const params = new HttpParams().set('search', text);
    return this.http.get<any>(`${API}/chat/msg/search`,{ params })
  }

  searchUsers(text) {
    const params = new HttpParams().set('search', text);
    return this.http.get<any>(`${API}/chat/msg/search/user`,{ params })
  }

}



