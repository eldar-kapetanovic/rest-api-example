import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../models/post.model';


@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiRoot = 'https://test-423cd.firebaseio.com/posts';

    constructor(private httpClient: HttpClient) { }

    getPosts(): Observable<Post[]> {
        return this.httpClient
            .get(this.apiRoot + '.json')
            .pipe(
                map(
                    (posts: Array<any>) => {
                        return (posts == null ? [] : posts).map((post: any, index: number) => (new Post({ ...post, postIndex: index })));
                    }
                )
            );
    }

    updatePosts(posts: Post[]): Observable<Post[]> {
        posts.forEach(
            (post: Post) => (delete post.postIndex)
        );
        return this.httpClient
            .put(this.apiRoot + '.json', posts)
            .pipe(
                map(
                    (updatedPosts: Array<any>) => {
                        return (updatedPosts || []).map((post: any, index: number) => (new Post({ ...post, postIndex: index })));
                    }
                )
            );
    }

    getPost(postIndex: number): Observable<Post> {
        return this.httpClient
            .get(`${this.apiRoot}/${postIndex}.json`)
            .pipe(
                map(
                    (post: any) => {
                        return new Post({ ...post, postIndex: postIndex });
                    }
                )
            );
    }

    updatePost(post: Post): Observable<Post> {
        const postIndex = post.postIndex;
        delete post.postIndex;
        return this.httpClient
            .put(`${this.apiRoot}/${postIndex}.json`, post)
            .pipe(
                map(
                    (updatedPost: any) => {
                        return new Post({ ...updatedPost, postIndex: postIndex });
                    }
                )
            );
    }

    updatePostComments(post: Post): Observable<Post> {
        return this.httpClient
            .put(`${this.apiRoot}/${post.postIndex}/comments.json`, post.comments)
            .pipe(
                map(
                    (comments: any) => {
                        return new Post({ ...post, comments: [...(comments || [])] });
                    }
                )
            );
    }
}
