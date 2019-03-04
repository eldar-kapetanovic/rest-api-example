import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PostsComponent } from './componets/posts/posts.component';
import { PostComponent } from './componets/post/post.component';
import { MaterialComponentsModule } from './modules/material-components.module';
import { PostDetailsComponent } from './componets/post-details/post-details.component';
import { EditPostComponent } from './componets/edit-post/edit-post.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoginDialogComponent } from './componets/login-dialog/login-dialog.component';
import { PendingChangesGuard } from './services/pending-changes.guard';


const appRoutes: Routes = [
    { path: 'posts', component: PostsComponent, data: { title: 'Posts List', export: true, addPost: true } },
    { path: 'post-details/:postIndex', component: PostDetailsComponent, data: { title: 'Post Details' } },
    { path: 'edit-post/:postIndex', component: EditPostComponent, data: { title: 'Edit Post' }, canDeactivate: [PendingChangesGuard] },
    { path: '', redirectTo: '/posts', pathMatch: 'full' },
    { path: '**', redirectTo: '/posts' }
];

@NgModule({
    declarations: [
        AppComponent,
        PostsComponent,
        PostComponent,
        PostDetailsComponent,
        EditPostComponent,
        LoginDialogComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialComponentsModule,
        RouterModule.forRoot(appRoutes)
    ],
    entryComponents: [
        LoginDialogComponent
    ],
    providers: [
        PendingChangesGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
