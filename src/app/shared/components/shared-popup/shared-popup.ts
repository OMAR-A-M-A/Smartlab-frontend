import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PopupData } from '../../interfaces/shared-popup.interface';

@Component({
  selector: 'app-shared-popup',
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './shared-popup.html',
  styleUrl: './shared-popup.css',
})
export class SharedPopup {
  public dialogRef = inject(MatDialogRef<SharedPopup>);
  public data: PopupData = inject(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);

  onAction(value: string) {
    this.dialogRef.close(value);
  }

  copyId() {
    if (this.data.patientId) {
      navigator.clipboard
        .writeText(this.data.patientId)
        .then(() => {
          this.snackBar.open('ID copied to clipboard!', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
        })
        .catch((err) => {
          console.error('Failed to copy ID: ', err);
        });
    }
  }
}
