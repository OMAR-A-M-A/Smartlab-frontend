import { Component, inject,OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth/auth';
@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // To get the token from URL
  private snackBar = inject(MatSnackBar);

  token: string | null = null;

  resetForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    // Get token from URL (e.g., /reset-password?token=xyz)
    this.token = this.route.snapshot.paramMap.get('token');
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000 });
      return;
    }
    const cleanToken = this.token.trim();
    const payload = {
      password: newPassword,
    };

    this.authService.resetPassword(cleanToken, payload).subscribe({
      next: () => {
        this.snackBar.open('Password reset successful! You can now login.', 'Close', {
          duration: 4000,
          panelClass: ['success-snackbar'],
        });
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const backendErrorMessage =
          err.error?.message ||
          err.error?.error ||
          'Error resetting password. The link might be expired.';
        // this.snackBar.open('Error resetting password. The link might be expired.', 'Close', {
        this.snackBar.open(`Failed: ${backendErrorMessage}`, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
