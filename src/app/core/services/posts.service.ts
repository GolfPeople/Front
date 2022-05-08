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

  createPostWithImageFile(description, files, ubication) {
    const formData: any = new FormData();

    files.forEach((file, index) => {
      const fileName = `${file.size}${index}`;
      formData.append('files[]', file, fileName);
    });

    // formData.append('files[]', files);
    formData.append('description', description);
    formData.append('ubication', ubication);

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
        this.posts.next(posts);
        console.log(posts);
      });
  }

  getPost(id) {
    return this.http.get<PostsResponse>(`${URL}/publish/show/${id}`);
  }

  editPost(description, files, ubication, id) {
    const formData: any = new FormData();

    files.forEach((file, index) => {
      const fileName = `${file.size}${index}`;
      formData.append('files[]', file, fileName);
    });

    // formData.append('files[]', files);
    formData.append('description', description);
    formData.append('ubication', ubication);
    console.log('file', files);
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http
      .post<Post>(
        `${URL}/publish/my_publish/${id}`,
        { description, files, ubication },
        headers
      )
      .subscribe((res) => {
        console.log(res);
        this.getPosts();
      });
  }

  deletePost(id) {
    const formData = new FormData();
    const options = '2';
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    formData.append('options', options);
    return this.http
      .post(`${URL}/publish/my_publish/toogle/${id}`, formData, headers)
      .subscribe((res) => {
        console.log(res);
        this.getPosts();
      });
  }
}
