import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { AppContextStore } from '../../store/app-context.store';
import { StoreContext } from '../../models/store-context.model';
import { PostService } from '../../services/post.service';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { ConfirmDialogData } from '../../models/confirm-dialog-data.model';


@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
    posts: Post[];
    comments: Comment[];
    authenticated = false;
    saving = false;
    stateSubscription: Subscription;

    constructor(
        private appContext: AppContextStore,
        private postService: PostService,
        private matDialog: MatDialog
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
        if (this.authenticated && !this.saving) {
            this.saving = true;
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
                        this.saving = false;
                    },
                    (error) => {
                        this.saving = false;
                    }
                );
        }
    }

    onConfirmPostDeletion(post: Post) {
        const confirmPostDeletionData = new ConfirmDialogData({
            title: 'Confirm Post Delete',
            message: `Are you sure you want to delete: <b>"${post.title}"</b> Post?`,
            actionConfirmed: false
        });
        const matDialogReference = this.matDialog.open(ConfirmActionComponent, {
            width: '370px',
            height: '270px',
            data: confirmPostDeletionData
        });

        matDialogReference.afterClosed()
            .subscribe(
                () => {
                    if (matDialogReference.componentInstance.data && matDialogReference.componentInstance.data.actionConfirmed === true) {
                        this.onDeletePost(post);
                    }
                }
            );
    }
}
