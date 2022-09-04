import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseService } from './services/firebase.service';
import { LanguageService } from './services/language.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private firebaseSvc: FirebaseService
    ) {

      this.initializeApp();
    }

  initializeApp(){
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
    })
  }




}
