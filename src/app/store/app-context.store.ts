import { Injectable } from '@angular/core';

import { GenericStore } from './generic.store';
import { StoreContext } from '../models/store-context.model';
import { Post } from '../models/post.model';


@Injectable({
    providedIn: 'root'
})
export class AppContextStore extends GenericStore<StoreContext> {

    constructor() {
        super(new StoreContext());
    }

    setAuthenticated(authenticated: boolean) {
        this.setState({
            ...this.state,
            authenticated: authenticated
        });
    }

    setPosts(posts: Post[]) {
        this.setState({
            ...this.state,
            posts: posts
        });
    }

    reset() {
        const state = new StoreContext();
        this.setState(state);
    }
}
