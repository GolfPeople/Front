import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
//import { AppSettingsConfig } from '@app/core/configs/app-settings.config';
//import { LocalStorageService, CurrentUserService, ApiService } from 'src/app/services';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/login/user.model';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { AppSettingsConfig } from 'src/app/core/services/configs/app-settings.config';
import { CurrentUserService } from 'src/app/core/services/current-user.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages: any;
  selectedLanguage: any;
  sub: Subscription;
  user: User;
  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    private appConfig: AppSettingsConfig,
    private localStorage: LocalStorageService,
    private currentUserService: CurrentUserService
  ) {
  }

  ngOnInit(): void {
    this.languages = this.languageService.getLanguages();
    // Set the selected language from default languages
    console.log('LocaleSelector/init() translateService.currentLang:', this.translateService.currentLang);
    this.selectedLanguage = this.findLocaleById(this.translateService.currentLang);
    
    this.sub = this.currentUserService.currentUser()
      .pipe(
        //filter(value => value !== null && value._id !== undefined)
      )
      .subscribe((user: User) => {
        console.log('LocaleSelector/init() subscribe user; got user');
        this.user = user;
        //this.setLanguage(this.findLocaleById(this.user.locale));
      });
  }

  /**
 * Set the language
 *
 * @param lang
 */
  setLanguage(lang): void {
    console.log('setLanguage() lang:', lang);
    // Set the selected language for the toolbar (id, flag)
    this.selectedLanguage = lang;
    // Use the selected language for translations
    
    setTimeout(_ => this.translateService.use(lang.value), 200);
    this.languageService.setLanguage(lang.value);
    // Store language in cookies to be used next time
    //this.localStorage.setUserLang(lang.id);
  }

  selectLanguage(lang): void {
    console.log('selectLanguage() lang:', lang);
    this.setLanguage(lang);
    if (this.user) {
      // this.apiService.updateUser(this.user._id, { locale: lang.id })
      //   .subscribe((user)=> {
      //     this.currentUserService.langChanged.next(lang.id);
      //     console.log('selectLanguage() user updated; user:', user);
      //     this.user = user;
      //     this.currentUserService.setUser(user);
      //   });
    }
  }

  findLocaleById(lang) {
    return this.languages.find(l => l.value === lang);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
