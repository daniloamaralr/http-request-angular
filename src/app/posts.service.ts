import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators'
import { Post } from './post.model'

@Injectable({ providedIn: 'root' })
export class PostsService {
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
            });
    }

    fetchPosts() {
        return this.http
            .get<{ [key: string]: Post }>('https://http-request-angular-fc200.firebaseio.com/posts.json')
            .pipe(
                map(responseData => {
                    const postArray: Post[] = []
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postArray.push({ ...responseData[key], id: key })
                        }
                    }
                    return postArray
                })
            )
    }
}
