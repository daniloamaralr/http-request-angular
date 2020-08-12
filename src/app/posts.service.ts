import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators'
import { Post } from './post.model'
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();
    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData = { title: title, content: content }

        this.http
            .post<{ name: string }>(
                'https://http-request-angular-fc200.firebaseio.com/posts.json',
                postData
            )
            .subscribe(responseData => {
                console.log(responseData);
            }, error => {
                this.error.next(error.message);
            });
    }

    fetchPosts() {
        let searchParams = new HttpParams()
        searchParams = searchParams.append('id','1')
        searchParams = searchParams.append('name','oia')
        return this.http
            .get<{ [key: string]: Post }>(
                'https://http-request-angular-fc200.firebaseio.com/posts.json',
                {
                   headers: new HttpHeaders({'Custom-Header':'Hello'}),
                   //params: new HttpParams().set('print', 'pretty')
                   params: searchParams
                }

            )
            .pipe(
                map(responseData => {
                    const postArray: Post[] = []
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postArray.push({ ...responseData[key], id: key })
                        }
                    }
                    return postArray
                }),
                catchError(errorRes => {
                    return throwError(errorRes)
                })
            )
    }

    deletePosts() {
        return this.http.delete('https://http-request-angular-fc200.firebaseio.com/posts.json')
    }
}
