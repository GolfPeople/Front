import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase/compat/app';
import { getStorage, ref, uploadString } from "firebase/storage";
import { of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {



  constructor(
    private auth: AngularFireAuth,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private router: Router,
    private http: HttpClient
  ) {

    this.updateOnUser().subscribe(); 
    this.updateOnAway();
  }

  getPresence(uid: string) {
    return this.db.doc(`status/${uid}`).valueChanges();
  }

  getUser() {
    return this.auth.authState.pipe(first()).toPromise();
  }

  async setPresence(status: string) {
    let user = await this.getUser();
    if (user) {
      return this.db.collection('status').doc(user.uid).set({
        status, timestamp: firebase.default.firestore.FieldValue.serverTimestamp()
      })
    }
  }

  updateOnUser() {
    let connection = this.db.doc('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    );

    return this.auth.authState.pipe(
      switchMap(user => user ? connection : of('offline')),
      tap(status => this.setPresence(status))
    )
  }

  updateOnAway() {
    document.onvisibilitychange = (e) => {
      if (document.visibilityState === 'hidden') {
        this.setPresence('offline')
      } else {
        this.setPresence('online')
      }
    }
  }
 

  Login(user) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  exchangeRates() {
    return this.http.get<any>('https://s3.amazonaws.com/dolartoday/data.json');
  }

  //========= Funciones Comunes para consultar Firestore==========
  /**
   * @param id Es el id del documento almacenado en una colección.
   * @param collection Es el nombre de una colección. 
   * @param condition Es la condición para consultar una colección.
   * @param object Es un objeto que contiene datos para guardar o actualizar.
   * @param field Es el campo perteneciente a un documento.
   */


  /**Retorna datos de un documento por su id*/
  getDataById(collection, id) {
    return this.db.doc(collection + '/' + id);
  }

  /**Retorna todos los documentos pertenecientes a una colección*/
  getCollection(collection) {
    return this.db.collection(collection).snapshotChanges();
  }

  /**Retorna todos los documentos pertenecientes a una colección condicionada*/
  getCollectionConditional(collection, condition) {
    return this.db.collection(collection, condition).snapshotChanges();
  }

  /**Agrega un documento nuevo a una colección*/
  addToCollection(collection, object) {
    return this.db.collection(collection).add(object);
  }

  /**Agrega un documento nuevo a una colección asignandole
    un id personalizado al documento */
  addToCollectionById(collection, object) {
    return this.db.collection(collection).doc(object.id).set(object);
  }

  /**Actualiza un documento existente en una colección*/
  UpdateCollection(collection, object) {
    return this.db.collection(collection).doc(object.id).update(object);
  }

  /**Elimina un documento existente en una colección*/
  deleteFromCollection(collection, id) {
    return this.db.doc(collection + '/' + id).delete();
  }

  /**
   * Marca los mensajes como leídos una vez el usuario entra al chat
     **/
  markAsRead(user_id, chatId) {

    return this.db.firestore.collection('messages').get().then(function (querySnapshot) {
      querySnapshot.query.where('chatId', '==', chatId).get()
        .then(function (querySnapshot) {
          querySnapshot.query.where('user_id', '!=', user_id).get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({ read: true })
              })
            })
        })
    });
  }

  /**Elimina todos los elementos con un campo similar
   * Se utiliza para hacer eliminaciones relacionales
   * Ejemplo: Todos los productos pertenecientes a una categoría. 
   **/
  deleteFromCollectionCascade(collection, field, id) {

    return this.db.firestore.collection(collection).get().then(function (querySnapshot) {
      querySnapshot.query.where(field, '==', id).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()
        })
      })
    });

  }

  countCollectionElements(collection) {
    return this.db.collection(collection).get();
  }


  async uploadPhoto(id, file): Promise<any> {
    console.log("STORAGE DE FIREBASE NO DISPONIBLE");
    // const storage = getStorage();
    // const storageRef = ref(storage, id);
    // return uploadString(storageRef, file, 'data_url').then(res => {
    //   return this.storage.ref(id).getDownloadURL().toPromise();
    // })
  }

  async logout() {
    await this.setPresence('offline');
    this.auth.signOut().then(async () => {
      localStorage.removeItem('user_id');
    });
  }





  //============Componentes comunes=========

  loader() {
    return this.loadingController;
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  async Toast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: 'primary',
      position: 'middle'
    });
    toast.present();
  }

}

