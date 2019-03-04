import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmDialogData } from '../../models/confirm-dialog-data.model';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';


@Component({
    selector: 'app-confirm-action',
    templateUrl: './confirm-action.component.html',
    styleUrls: ['./confirm-action.component.scss']
})

export class ConfirmActionComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    ngOnInit() { }

    onConfirm() {
        this.data.actionConfirmed = true;
        this.dialogRef.close();
    }

    onCancel() {
        this.data.actionConfirmed = false;
        this.dialogRef.close();
    }
}
