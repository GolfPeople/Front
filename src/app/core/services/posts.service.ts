import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post, PostsResponse } from '../interfaces/interfaces';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  // getPosts(){}

  createPost(description, files, ubication) {
    const dto = {
      description,
      files,
      ubication,
    };
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http.post<Post>(`${URL}/publish`, dto, headers);
  }

  createPostWithImageFile(description, files: File[], ubication) {
    const formData: any = new FormData();
    formData.append('description', description);
    formData.append('files', files);
    formData.append('ubication', ubication);

    return this.http.post<Post>(`${URL}/publish`, formData);
  }

  getPosts() {
    return this.http.get<Post[]>(`${URL}/publish/my_publish`);
  }
}
