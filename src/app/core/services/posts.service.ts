import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post, PostsResponse } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts = new BehaviorSubject<Post[]>([]);
  posts$ = this.posts.asObservable();

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

  createPostWithImageFile(description, files, ubication) {
    // const formData: any = new FormData();
    // formData.append('description', description);
    // formData.append('files', files);
    // formData.append('ubication', ubication);
    const dto = {
      description,
      files: FileList,
      ubication,
    };

    return this.http.post<Post>(`${URL}/publish`, dto);
  }

  getPosts() {
    return this.http
      .get<Post[]>(`${URL}/publish/my_publish`)
      .subscribe((posts) => {
        console.log(posts);
        this.posts.next(posts);
      });
  }

  editPost(description, files, ubication, id) {
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
    return this.http
      .post<Post>(`${URL}/publish/my_publish/${id}`, dto, headers)
      .subscribe((res) => {
        console.log(res);
        this.getPosts();
      });
  }

  deletePost(id) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http.delete<Post>(`${URL}/publish/my_publish/${id}`, headers);
  }
}
