import { Component, OnInit } from '@angular/core';
import { Router, ResolveEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { initializeApp } from 'firebase/app';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { AuthService } from './services/auth.service';
import { AppContextStore } from './store/app-context.store';
import { StoreContext } from './models/store-context.model';
import { LoginDialogComponent } from './componets/login-dialog/login-dialog.component';
import { PostService } from './services/post.service';
import { Post } from './models/post.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = '';
    export = false;
    addPost = false;
    authenticated = false;
    posts: Post[] = [];
    downloadJsonHref: SafeUrl;

    constructor(
        private router: Router,
        private authService: AuthService,
        private appContext: AppContextStore,
        private postService: PostService,
        private matDialog: MatDialog,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        initializeApp({
            apiKey: 'AIzaSyCA40Gmnu_Uv2bFVPE7XE2RVtggfWsfokY',
            authDomain: 'test-423cd.firebaseapp.com'
        });
        this.router.events
            .pipe(
                filter(
                    (event: any) => (event instanceof ResolveEnd)
                )
            )
            .subscribe(
                (event: ResolveEnd) => {
                    this.title = event.state.root.firstChild.data['title'];
                    this.export = event.state.root.firstChild.data['export'] || false;
                    this.addPost = event.state.root.firstChild.data['addPost'] || false;
                }
            );
        this.appContext.state$
            .pipe(
                filter(state => !!state),
                distinctUntilChanged()
            )
            .subscribe(
                (storeContext: StoreContext) => {
                    this.authenticated = storeContext.authenticated === undefined ? false : storeContext.authenticated;
                    this.posts = storeContext.posts || [];
                    this.generateDownloadJsonUri();
                }
            );
        this.postService.getPosts()
            .subscribe(
                (posts: Post[]) => {
                    this.appContext.setPosts(posts);
                }
            );
        firebase.auth().onAuthStateChanged(
            (stateChanged: firebase.User) => {
                if (stateChanged) {
                    stateChanged.getIdToken()
                        .then(
                            (token: string) => (this.appContext.setAuthenticated(!(token == null || (token != null && token === ''))))
                        )
                        .catch(
                            () => (this.appContext.setAuthenticated(false))
                        );
                } else {
                    this.appContext.setAuthenticated(false);
                }
            }
        );
    }

    generateDownloadJsonUri() {
        const postsToDownload = this.posts
            .map((post: Post) => (new Post(post)));
        postsToDownload
            .forEach((post: Post) => (delete post.postIndex));
        const jsonString = JSON.stringify(postsToDownload, null, 2);
        const blob = new Blob([jsonString], { type: 'text/json' });
        const url = window.URL.createObjectURL(blob);
        const uri: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.downloadJsonHref = uri;
    }

    openLoginDialog() {
        this.matDialog.open(LoginDialogComponent, {
            width: '480px',
            height: '350px',
            data: { username: '', password: '' }
        });
    }

    onLogin(username: string, password: string) {
        this.authService.logIn(username, password);
    }

    onLogout() {
        this.authService.logOut();
    }
}
