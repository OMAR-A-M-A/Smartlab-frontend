import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please enter your email and password', 'Close', { duration: 3000 });
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.saveRole(response.role);

        if (response.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'staff') {
          this.router.navigate(['/staff/dashboard']);
        } else if (response.role === 'patient') {
          if (response.isFirstLogin) {
            this.router.navigate(['/change-password']);
          } else {
            this.router.navigate(['/patient/dashboard']);
          }
        }
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.snackBar.open('Login failed, please check your credentials!', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
