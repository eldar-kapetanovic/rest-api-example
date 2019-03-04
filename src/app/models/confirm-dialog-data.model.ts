export class ConfirmDialogData {
    title: string;
    message: string;
    actionConfirmed: boolean;

    constructor(confirmDialogData?: ConfirmDialogData) {
        if (confirmDialogData) {
            this.title = confirmDialogData.title;
            this.message = confirmDialogData.message;
            this.actionConfirmed = confirmDialogData.actionConfirmed;
        }
    }
}
