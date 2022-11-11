import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getCurrentUser() {
    let json: any;
    try {
      json = localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id') || '') : null;
    } catch (err) {
      console.warn(err);
      json = null;
    }
    return json;
  }
  
  getCurrentConfiguration(){
    let json: any;
    try {
      json = localStorage.getItem('configuration') ? JSON.parse(localStorage.getItem('configuration') || '') : null;
    } catch (err) {
      console.warn(err);
      json = null;
    }
    return json;
  }


  setConfiguration(configuration) {
    localStorage.setItem('configuration', JSON.stringify(configuration));
  }

  removeConfiguration() {
    localStorage.removeItem('configuration');
  }

  removeLoggedAccount() {
    localStorage.removeItem('user_id');
  }

  getUserLang(): string {
    return localStorage.getItem('lang') || ''
  }

  setUserLang(lang: string): void {
    if (lang) localStorage.setItem('lang', lang)
  }
}
