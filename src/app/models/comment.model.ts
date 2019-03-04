export class Comment {
    name: string;
    body: string;

    constructor(comment?: Comment) {
        if (comment) {
            this.name = comment.name;
            this.body = comment.body;
        }
    }
}
