import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { UserAuth } from '../models/auth.interface';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async resetPassword(email: string): Promise<any> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async loginGoogle(): Promise<any> {
    try {
      const { user } = await this.afAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      return user;
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async register(email: string, password: string): Promise<UserAuth> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async login(email: string, password: string): Promise<UserAuth> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Error -->', error);
    }
  }
}
