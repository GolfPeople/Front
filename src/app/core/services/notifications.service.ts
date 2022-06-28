import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notifications.interface';
import { BehaviorSubject } from 'rxjs';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private noReadedNotifications = new BehaviorSubject<Notification[]>([]);
  noReadedNotifications$ = this.noReadedNotifications.asObservable();
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();
  private counter = new BehaviorSubject<number>(0);
  counter$ = this.counter.asObservable();

  constructor(private http: HttpClient) {}

  noRead() {
    return this.http.get<Notification[]>(`${URL}/notifications/my/notread`);
  }
  noReaedCount() {
    return this.http
      .get<Notification[]>(`${URL}/notifications/my/notread`)
      .subscribe((res) => {
        if (res.length) {
          this.noReadedNotifications.next(res);
          this.counter.next(res.length);
        }

        return;
      });
  }

  getBothNotifi() {
    this.http
      .get<Notification[]>(`${URL}/notifications/my/notread`)
      .subscribe((res) => {
        if (res.length) this.noReadedNotifications.next(res);

        this.all().subscribe((res) => {
          if (res.length) this.noReadedNotifications.next(res);
        });
      });
  }

  updateCounter(value: number) {
    this.counter.next(value);
  }

  all() {
    return this.http.get<Notification[]>(
      `https://api.app.golfpeople.com/api/notifications/my/all`
    );
  }

  markAsRead() {
    return this.http.post(`${URL}/notifications/my/markread`, {});
  }

  // Marca una notificacion como leidas
  markAsReadOne(id) {
    const key = id;
    return this.http.post(`${URL}/notifications/my/markreadone`, { key });
  }

  delete() {
    return this.http.post(`${URL}/notifications/my/delete`, {});
  }
}
