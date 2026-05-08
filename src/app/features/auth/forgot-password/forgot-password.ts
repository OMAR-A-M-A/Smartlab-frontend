import { Component ,inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth/auth';
@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  forgotForm = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.forgotForm.invalid) return;
    const payload = {
      email: this.forgotForm.value.identifier,
    };
    this.authService.forgotPassword(payload).subscribe({
      next: () => {
        this.snackBar.open('If the account exists, a reset link/code has been sent.', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open('Failed to process request. Try again.', 'Close', { duration: 4000 });
      },
    });
  }
}
