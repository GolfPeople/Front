import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  Post,
  PostsResponse,
  PostResponseData,
} from '../interfaces/interfaces';
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

  //Método para obtener todas la publicaciones
  all(page = 1) {
    const params = new HttpParams().set('page', page);
    return this.http
      .get<PostResponseData>(`${URL}/publish/get`, { params })
      .pipe(retry(3));
  }

  //Trae todos las publicaciones del usuario logueado con paginación.
  myPosts(page) {
    const params = new HttpParams().set('page', page);
    return this.http
      .get<PostResponseData>(`${URL}/publish/my_publish`, { params })
      .pipe(retry(3));
  }

  //Trae todos las publicaciones del usuario logueado
  async getPosts(page = 1) {
    const params = new HttpParams().set('page', page);
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });

    await loading.present();

    this.http
      .get<PostResponseData>(`${URL}/publish/my_publish`, { params })
      .pipe(retry(3))
      .subscribe((data) => {
        this.posts.next(data.data);
        // console.log(data);
        loading.dismiss();
      });
  }

  getPostsByUser(id, page) {
    const params = new HttpParams().set('page', page);

    return this.http.get<PostResponseData>(`${URL}/profile/publish/${id}`, {
      params,
    });
  }

  //Actualiza la lista de publicaciones
  getPostsAction(page = 1) {
    const params = new HttpParams().set('page', page);
    this.http
      .get<PostResponseData>(`${URL}/publish/my_publish`, { params })
      .pipe(retry(3))
      .subscribe((data) => {
        this.posts.next(data.data);
        // console.log(data);
      });
  }

  //Trae todas las publicaciones de acuerdo al hastag selecionado
  getPostsByHashtag(hashtag, page = 1) {
    const params = new HttpParams().set('page', page);

    return this.http.get<PostResponseData>(`${URL}/publish/hashtag/${hashtag}`);
  }

  //Trae una sola publicación
  getPost(id) {
    return this.http.get<PostsResponse>(`${URL}/publish/show/${id}`);
  }

  //Crea una publicaión
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

  createPostWithImageFile(
    description,
    files,
    ubication,
    tags,
    friendsName: string[],
    friendsId: string[]
  ) {
    const formData: any = new FormData();

    files.forEach((file, index) => {
      const fileName = `${file.size}${index}`;
      formData.append('files[]', file, fileName);
    });
    console.log({
      description,
      files,
      ubication,
      tags,
      friendsName,
      friendsId,
    });

    formData.append('friends_name', friendsName);
    formData.append('friends_id', friendsId);

    formData.append('friends', tags);
    formData.append('description', description);
    formData.append('ubication', ubication);

    console.log('file', files);

    return this.http.post<Post>(`${URL}/publish`, formData);
  }

  //Edita una publicación
  editPost(
    description,
    files,
    ubication,
    friendsName: string[],
    friendsId: string[],
    id
  ) {
    const formData: any = new FormData();

    files.forEach((file, index) => {
      const fileName = `${file.size}${index}`;
      formData.append('files[]', file, fileName);
    });
    formData.append('friends_name', friendsName);
    formData.append('friends_id', friendsId);
    formData.append('description', description);
    formData.append('ubication', ubication);
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http.post<Post>(`${URL}/publish/my_publish/${id}`, formData);
    // .subscribe(() => {
    //   this.getPosts();
    //   this.getPosts();
    // });
  }

  //Elimina una publicación
  deletePost(id) {
    const formData = new FormData();
    const option = '3';

    formData.append('option', option);
    return this.http.post(`${URL}/publish/my_publish/toogle/${id}`, formData);
    // .subscribe((res) => {
    //   console.log('delete -->', res);
    //   this.getPosts();
    // });
  }

  //Guardar una publicación
  savePost(id) {
    return this.http.post(`${URL}/publish/toogle/favorite/${id}`, {});
  }

  getSavedPosts() {
    return this.http.get<PostResponseData>(`${URL}/publish/favorites`);
  }
}
