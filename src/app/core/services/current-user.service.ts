import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/login/user.model';
import { AppSettingsConfig } from './configs/app-settings.config';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<any>({});
  private configuration = new BehaviorSubject<any>(null);

  public langChanged:BehaviorSubject<any> = new BehaviorSubject('');
  
  constructor(private appConfig: AppSettingsConfig) { }

  currentUser(): Observable<User> {
    return this.user.asObservable();
  }

  currentConfiguration(): Observable<any> {
    return this.configuration.asObservable();
  }

  getUser(): User {
    return this.user.value;
  }

  getConfiguration(): any {
    return this.configuration.value;
  }

  get gettingConfiguration() {
    return this.configuration.asObservable();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  remove() {
    this.loggedIn.next(false);
    this.configuration.next(false);
    this.user.next(null!);
  }

  updateUser(user: User) {
    //this.user.next({ ...this.user.value, ...user });
  }

  setUser(user: User) {
    console.log('CurrentUserService/setUser()');
    //this.user.next({ ...user });
  }

  setConfiguration(configuration) {
    console.log('CurrentUserService/setConfiguration()');
    this.configuration.next({ ...configuration });
  }
  
  updateConfiguration(configuration) {
    this.configuration.next({ ...this.configuration.value, ...configuration });
  }

  setLoggedIn(loggedIn: boolean) {
    console.log('CurrentUserService/setLoggedIn()');
    this.loggedIn.next(loggedIn);
  }
}
