import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  selected = new BehaviorSubject('');

  constructor(private translate: TranslateService) { }

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    this.setLanguage(language);    
  }

  getLanguages() {
    return [
      { text: this.translate.instant('LANGUAGE.english'), value: 'en', icon: 'assets/icon/english.svg' },
      { text: this.translate.instant('LANGUAGE.spanish'), value: 'es', icon: 'assets/icon/spanish.svg' }
    ];
  }

  setLanguage(lng) {
    this.translate.use(lng);
    this.selected.next(lng);
    localStorage.setItem('language', lng);
  }
}