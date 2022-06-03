import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { User } from '../../models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUser: User = null

  constructor() { }
}
