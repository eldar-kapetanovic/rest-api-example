import { Post } from './post.model';


export class StoreContext {
    authenticated: boolean;
    posts: Post[];
}
