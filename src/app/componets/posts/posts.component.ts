import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { AppContextStore } from '../../store/app-context.store';
import { StoreContext } from '../../models/store-context.model';
import { PostService } from '../../services/post.service';


@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
    posts: Post[];
    comments: Comment[];
    authenticated = false;
    stateSubscription: Subscription;

    constructor(
        private appContext: AppContextStore,
        private postService: PostService
    ) { }

    ngOnInit() {
        this.stateSubscription = this.appContext.state$
            .pipe(
                filter(state => !!state),
                distinctUntilChanged()
            )
            .subscribe(
                (state: StoreContext) => {
                    this.authenticated = state.authenticated === undefined ? false : state.authenticated;
                    this.posts = state.posts || [];
                }
            );
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    onDeletePost(post: Post) {
        let posts;
        if (this.authenticated) {
            posts = this.appContext.state.posts.map(
                (statePost: Post) => (new Post(statePost))
            );
            if (posts.length > 0 && posts.length > post.postIndex) {
                posts.splice(post.postIndex, 1);
            }
            this.postService.updatePosts(posts)
                .subscribe(
                    (updatedPosts: Post[]) => {
                        this.appContext.setPosts(updatedPosts);
                    }
                );
        }
    }
}
