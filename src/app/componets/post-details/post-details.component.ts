import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { AppContextStore } from '../../store/app-context.store';
import { StoreContext } from '../../models/store-context.model';

@Component({
    selector: 'app-post-details',
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, OnDestroy {
    post: Post;
    comments: Comment[] = [];
    authenticated = false;
    appContextSubscription: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appContext: AppContextStore,
        private postService: PostService
    ) { }

    ngOnInit() {
        this.appContextSubscription = this.appContext.state$
            .pipe(
                filter(state => !!state),
                map(
                    (state: StoreContext) => (state.authenticated)),
                distinctUntilChanged()
            )
            .subscribe(
                (authenticated: boolean) => {
                    this.authenticated = authenticated === undefined ? false : authenticated;
                }
            );
        const postIndex: number = Number(this.activatedRoute.snapshot.params.postIndex);
        if (postIndex != null && !isNaN(postIndex)) {
            this.postService.getPost(postIndex)
                .subscribe(
                    (post: Post) => {
                        if (post) {
                            this.post = post;
                        } else {
                            this.navigateToHome();
                        }
                    },
                    (error: any) => {
                        this.navigateToHome();
                    }
                );
        } else {
            this.navigateToHome();
        }
    }

    ngOnDestroy() {
        if (this.appContextSubscription) {
            this.appContextSubscription.unsubscribe();
        }
    }

    private navigateToHome() {
        this.router.navigate(['/', 'posts']);
    }
}
