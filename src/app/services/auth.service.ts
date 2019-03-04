import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    logIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logOut(): Promise<void> {
        return firebase.auth().signOut();
    }

    getToken(): Promise<string> {
        return firebase.auth().currentUser != null ? firebase.auth().currentUser.getIdToken() : new Promise(resolve => resolve(''));
    }

    isAuthenticated(): boolean {
        return firebase.auth().currentUser != null ? true : false;
    }
}
