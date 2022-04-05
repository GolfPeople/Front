import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  constructor(private http: HttpClient) {}

  uploadFile(file: Blob, license) {
    const dto = new FormData();
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    dto.append('photo', file);
    return this.http.post(
      `${this.apiUrl}/profile/1`,
      { dto, license },
      headers
    );
  }
}
