import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { User } from '../../models/chat.interface';

const API = `${environment.golfpeopleAPI}/api`

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // currentUser: User = null

  constructor(
    private http: HttpClient
  ) { }

  // Mensaje nuevo
  sendMessage(id, message){
    return this.http.post(`${API}/chat/new/${id}`, {message})
  }

  // Mis salas de chat
  getRoom() {
    return this.http.get(`${API}/chat/connet`)
  }

  // Sala de chat 
  getChat(id) {
    return this.http.get(`${API}/chat/${id}`)
  }





}
