import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { AppContextStore } from '../../store/app-context.store';
import { ComponentCanDeactivate } from '../../services/componetn-can-deactivate.interface';

@Component({
    selector: 'app-edit-post',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
    ready = false;
    post: Post;
    postForm: FormGroup;
    commentForms: FormGroup[] = [];
    unsavedData = false;
    firebaseAuthStateUnsubscribe: firebase.Unsubscribe;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appContext: AppContextStore,
        private postService: PostService,
        private matSnackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.firebaseAuthStateUnsubscribe = firebase.auth().onAuthStateChanged(
            (stateChanged: firebase.User) => {
                if (stateChanged) {
                    this.loadPost();
                } else {
                    this.navigateToHome();
                }
            }
        );
    }

    ngOnDestroy() {
        if (this.firebaseAuthStateUnsubscribe) {
            this.firebaseAuthStateUnsubscribe();
        }
    }

    canDeactivate(): Observable<boolean> | boolean {
        let canDeactivate = true;
        if (this.unsavedData) {
            canDeactivate = false;
        } else {
            canDeactivate = this.postForm ? (this.postForm.dirty ? false : canDeactivate) : true;
            this.commentForms
                .forEach(
                    (commentForm: FormGroup) => {
                        canDeactivate = commentForm.dirty ? false : canDeactivate;
                    }
                );
        }
        return canDeactivate;
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = 'WARNING: You have unsaved changes. Press Cancel to go back ' +
                'and save these changes, or OK to lose these changes.';
        }
    }

    private loadPost() {
        const postIndex: string = this.activatedRoute.snapshot.params.postIndex;
        if (postIndex === 'new') {
            this.post = new Post();
            this.commentForms = [];
            this.initializeForms(this.post);
        } else if (postIndex && !isNaN(Number(postIndex))) {
            this.postService.getPost(Number(postIndex))
                .subscribe(
                    (post: Post) => {
                        if (post && post.title !== undefined) {
                            this.post = post;
                            this.initializeForms(this.post);
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

    onAddComment() {
        if (this.post.postIndex !== undefined) {
            this.commentForms.push(
                new FormGroup(
                    {
                        'name': new FormControl('', [Validators.required]),
                        'body': new FormControl('', [Validators.required])
                    }
                )
            );
        }
    }

    onSubmitPost() {
        let posts: Post[];
        if (this.postForm.valid && this.commentForms.every((commentForm: FormGroup) => (commentForm.valid))) {
            this.post.title = this.postForm.value.title;
            this.post.body = this.postForm.value.body;
            this.setComments();
            posts = this.getPosts();
            if (this.post.postIndex !== undefined) {
                this.updatePost(posts, this.post);
            } else {
                posts.push(this.post);
                this.updatePosts(posts, true);
            }
        } else {
            this.matSnackBar.open('', 'Please validate data.', {
                duration: 5000,
            });
        }
    }

    onDeletePost() {
        const posts = this.getPosts();
        if (posts.length > 0 && posts.length > this.post.postIndex) {
            posts.splice(this.post.postIndex, 1);
        }
        this.updatePosts(posts);
        this.navigateToHome();
    }

    onCancelPost() {
        this.initializeForms(this.post);
    }

    onSubmitComment() {
        let posts: Post[];
        if (this.post.postIndex !== undefined) {
            if (this.commentForms.every((commentForm: FormGroup) => (commentForm.valid))) {
                this.setComments();
                posts = this.getPosts();
                this.updatePostComments(posts, this.post);
            } else {
                this.matSnackBar.open('', 'Please validate data.', {
                    duration: 5000,
                });
            }
        } else {
            this.matSnackBar.open('', 'Please save post data first.', {
                duration: 5000,
            });
        }
    }

    onDeleteComment(commentIndex: number) {
        let commentsValid = true;
        let posts: Post[];
        this.commentForms
            .forEach(
                (commentForm: FormGroup, index: number) => {
                    if (index !== commentIndex) {
                        commentsValid = commentForm.valid;
                    }
                }
            );
        if (commentsValid) {
            if (commentIndex >= 0 && this.commentForms.length > commentIndex) {
                this.commentForms.splice(commentIndex, 1);
                this.setComments();
                posts = this.getPosts();
                this.updatePostComments(posts, this.post);
            }
        } else {
            this.commentForms.splice(commentIndex, 1);
            this.unsavedData = true;
        }
    }

    onCancelComment(commentIndex: number) {
        if (commentIndex >= 0 && this.commentForms.length > 0 && this.commentForms.length > commentIndex) {
            if (this.post.comments && this.post.comments.length > 0 && this.post.comments.length > commentIndex &&
                this.post.comments[commentIndex]) {
                this.commentForms[commentIndex] = new FormGroup(
                    {
                        'name': new FormControl(this.post.comments[commentIndex].name, [Validators.required]),
                        'body': new FormControl(this.post.comments[commentIndex].body, [Validators.required])
                    }
                );
            } else {
                this.commentForms[commentIndex] = new FormGroup(
                    {
                        'name': new FormControl('', [Validators.required]),
                        'body': new FormControl('', [Validators.required])
                    }
                );
            }
        }
    }

    private setComments() {
        this.post.comments = [];
        this.commentForms
            .forEach(
                (commentForm: FormGroup) => {
                    this.post.comments.push(new Comment({ name: commentForm.value.name, body: commentForm.value.body }));
                }
            );
    }

    private updatePostComments(posts: Post[], post: Post) {
        this.postService.updatePostComments(post)
            .subscribe(
                (updatedPost: Post) => {
                    this.post = updatedPost;
                    posts[this.post.postIndex] = this.post;
                    this.appContext.setPosts(posts);
                    this.initializeCommentForms();
                },
                (error) => {
                    this.navigateToHome();
                }
            );
    }

    private updatePost(posts: Post[], post: Post) {
        this.postService.updatePost(post)
            .subscribe(
                (updatedPost: Post) => {
                    this.post = updatedPost;
                    posts[this.post.postIndex] = this.post;
                    this.appContext.setPosts(posts);
                    this.initializeForms(this.post);
                },
                (error) => {
                    this.navigateToHome();
                }
            );
    }

    private updatePosts(posts: Post[], navigateToLastPost = false) {
        this.postService.updatePosts(posts)
            .subscribe(
                (updatedPosts: Post[]) => {
                    this.appContext.setPosts(updatedPosts);
                    if (navigateToLastPost) {
                        this.post = posts[posts.length - 1];
                        this.initializeForms(this.post);
                        this.router.navigate(['/', 'edit-post', this.post.postIndex]);
                    }
                },
                (error) => {
                    this.navigateToHome();
                }
            );
    }

    private getPosts(): Post[] {
        return this.appContext.state.posts.map(
            (post: Post) => (new Post(post))
        );
    }

    private initializeForms(post: Post) {
        this.postForm = new FormGroup(
            {
                'title': new FormControl(post.title, [Validators.required]),
                'body': new FormControl(post.body, [Validators.required])
            }
        );
        this.initializeCommentForms();
        this.ready = true;
    }

    private initializeCommentForms() {
        if (this.post.comments && this.post.comments.length > 0) {
            this.commentForms = new Array<FormGroup>(this.post.comments.length);
            this.post.comments.forEach(
                (comment: Comment, index: number) => {
                    if (comment.name !== undefined) {
                        this.commentForms[index] = new FormGroup(
                            {
                                'name': new FormControl(comment.name, [Validators.required]),
                                'body': new FormControl(comment.body, [Validators.required])
                            }
                        );
                    }
                }
            );
        }
    }

    private navigateToHome() {
        this.router.navigate(['/', 'posts']);
    }
}
