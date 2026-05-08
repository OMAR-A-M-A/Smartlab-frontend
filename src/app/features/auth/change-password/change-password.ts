import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth/auth';
@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  changeForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.changeForm.invalid) return;

    if (this.changeForm.value.newPassword !== this.changeForm.value.confirmPassword) {
      this.snackBar.open('New passwords do not match!', 'Close', { duration: 3000 });
      return;
    }

    this.authService.updatePassword(this.changeForm.value).subscribe({
      next: () => {
        this.snackBar.open('Password updated successfully!', 'Close', { duration: 4000 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('Incorrect current password or server error.', 'Close', {
          duration: 4000,
        });
      },
    });
  }
}
