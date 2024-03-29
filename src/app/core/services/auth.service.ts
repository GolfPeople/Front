import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { UserAuth } from '../models/auth.interface';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';


import { getAdditionalUserInfo } from 'firebase/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<UserAuth>;


  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private platform: Platform
  ) {

    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          // console.log('Service -->',user)
          return this.afs
            .collection('users')
            .doc<UserAuth>(user.uid)
            .valueChanges();
        }
        return of(null);
      })
    );
  }

  async resetPassword(email: string): Promise<any> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async googleSignInMobile() {

    let googleUser = await GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    const { user } = await this.afAuth.signInWithCredential(credential)
    this.updateUserData(user);
    return user;

  }

  async loginGoogle(): Promise<any> {
    let user;
    try {

      if (this.platform.is('capacitor')) {

        let googleUser = await GoogleAuth.signIn();
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken)
        await this.afAuth.signInWithCredential(credential).then(res => {
          user = res;
        })

        this.updateUserData(user.user);
        return user;

      } else {

        await this.afAuth.signInWithPopup(
          new firebase.auth.GoogleAuthProvider()
        ).then(res => {
          user = res;
        })
        this.updateUserData(user.user);

        return user;
      }

    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async loginFacebook(): Promise<any> {

    let user;

    try {

      if (this.platform.is('capacitor')) {

        // let googleUser = await GoogleAuth.signIn();
        // const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        // const { user } = await this.afAuth.signInWithCredential(credential)
        // this.updateUserData(user);
        // return user;

      } else {

        await this.afAuth.signInWithPopup(
          new firebase.auth.FacebookAuthProvider()
        ).then(res => {
          user = res;
        })

        this.updateUserData(user.user);
        return user;
      }

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
      this.updateUserData(user);
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
  isEmailVerified(user: UserAuth) {
    return user.emailVerified === true ? true : false;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  private updateUserData(user: UserAuth) {
    const userRef: AngularFirestoreDocument<UserAuth> = this.afs
      .collection('users')
      .doc(user.uid);
    // console.log('userRef -->', userRef)
    const data: UserAuth = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };
    return userRef.set(data, { merge: true });
  }
}
