import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Post } from '../../models/post.model';


@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
    @Input() post: Post;
    @Input() authenticated = false;
    @Input() saving = false;
    @Output() deletePost = new EventEmitter<Post>();

    constructor() { }

    ngOnInit() { }

    onDeletePost() {
        this.deletePost.emit(this.post);
    }
}
