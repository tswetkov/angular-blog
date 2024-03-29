import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FbCreateResponse, Post } from './interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post> {
    return this.http
      .post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse) => ({ ...post, id: response.name }))
      );
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`).pipe(
      map((response: { [key: string]: any }) => {
        return Object.keys(response).map((key) => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date),
        }));
      })
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  getById(id: string): Observable<Post> {
    return this.http.get(`${environment.fbDbUrl}/posts/${id}.json`).pipe(
      map((post: Post) => {
        return {
          ...post,
          id,
          date: new Date(post.date),
        };
      })
    );
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(
      `${environment.fbDbUrl}/posts/${post.id}.json`,
      post
    );
  }
}
