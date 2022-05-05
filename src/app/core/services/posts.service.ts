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
  private posts = new BehaviorSubject<PostsResponse[]>([]);
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
    return this.http.post(`${URL}/publish`, dto, headers).subscribe((res) => {
      console.log(res);
      this.getPosts();
    });
  }

  createPostWithImageFile(description, files: FileList, ubication) {
    const formData: any = new FormData();
    formData.append('files[]', files);
    formData.append('description', description);
    formData.append('ubication', ubication);
    console.log('Archivos del formData -->', formData.get('files[]'), files);
    console.log('file', files);

    return this.http.post<Post>(`${URL}/publish`, formData).subscribe((res) => {
      console.log(res);
      console.log(files);
      this.getPosts();
    });
  }

  getPosts() {
    return this.http
      .get<PostsResponse[]>(`${URL}/publish/my_publish`)
      .subscribe((posts) => {
        console.log(posts);
        this.posts.next(posts);
      });
  }

  getPost(id) {
    return this.http.get<PostsResponse>(`${URL}/publish/show/${id}`);
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
    const formData: any = new FormData();
    const option = 0;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    formData.append('option', option);
    return this.http
      .post(`${URL}/publish/my_publish/toogle/${id}`, option, headers)
      .subscribe((res) => {
        console.log(res);
        this.getPosts();
      });
  }
}