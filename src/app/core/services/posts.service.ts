import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post, PostsResponse } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { filter, finalize, map, retry } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts = new BehaviorSubject<PostsResponse[]>([]);
  posts$ = this.posts.asObservable();

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  // getPosts(){}

  // getPosts() {
  //   return this.http
  //     .get<PostsResponse[]>(`${URL}/publish/my_publish`)
  //     .subscribe((posts) => {
  //       this.posts.next(posts);
  //     });
  // }
  async getPosts() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
    });

    await loading.present();

    this.http
      .get<PostsResponse[]>(`${URL}/publish/my_publish`)
      // .pipe(map((data) => data.filter((item) => item.files.lenth > 0)))
      .subscribe((data) => {
        this.posts.next(data.reverse());
        console.log(data);
        loading.dismiss();
      });
  }

  getPostsByHashtag() {
    return this.http.get<PostsResponse[]>(`${URL}/publish/my_publish`);
  }

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
      .subscribe(() => {
        this.getPosts();
      });
  }

  deletePost(id) {
    const formData = new FormData();
    const option = '3';

    formData.append('option', option);
    this.http
      .post(`${URL}/publish/my_publish/toogle/${id}`, formData)
      .subscribe((res) => {
        console.log('delete -->', res);
        this.getPosts();
      });
  }
}
