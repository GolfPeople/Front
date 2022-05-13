import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommentResponse } from '../models/comment.interface';

const URL = `${environment.golfpeopleAPI}/api`;

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  //Crea un comentario
  comment(description: string, post_id) {
    const formData = new FormData();
    formData.append('description', description);
    return this.http.post(`${URL}/publish/comment/create/${post_id}`, formData);
  }
  //Obtiene los comenatios de una publicaión
  getComments(post_id) {
    return this.http.get<Comment[]>(`${URL}/publish/comment/${post_id}`);
  }

  response() {}
}
