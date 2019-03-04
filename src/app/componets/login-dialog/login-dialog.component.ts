import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LoginDialogData } from '../../models/login-dialog-data.model';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LoginDialogData,
        private authService: AuthService
    ) { }

    onLogin() {
        this.errorMessage = '';
        this.authService.logIn(this.data.username, this.data.password)
            .then(
                () => (this.dialogRef.close())
            )
            .catch(
                (error) => {
                    this.errorMessage = error.message;
                }
            );
    }

    onCancel() {
        this.dialogRef.close();
    }
}
