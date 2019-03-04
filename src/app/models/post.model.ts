import { Comment } from './comment.model';


export class Post {
    postIndex: number;
    title: string;
    body: string;
    comments: Comment[];

    constructor(post?: Post) {
        if (post) {
            this.postIndex = post.postIndex;
            this.title = post.title;
            this.body = post.body;
            if (post.comments !== undefined) {
                if (post.comments.length > 0) {
                    post.comments = [...post.comments];
                } else {
                    post.comments = [];
                }
            }
            this.comments = post.comments;
        }
    }
}
