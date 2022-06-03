import firebase from 'firebase/compat/app';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: string;
}
