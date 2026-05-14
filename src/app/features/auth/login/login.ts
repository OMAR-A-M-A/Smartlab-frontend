import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please enter your UserName and password', 'Close', { duration: 3000 });
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.saveRole(response.data.role);
        if (response.data.gender) {
          this.authService.setUserGender(response.data.gender.toLowerCase());
        } else if (response.data.accountId?.gender) {
          this.authService.setUserGender(response.data.accountId.gender.toLowerCase());
        }
        this.snackBar.open(`logged In Successfully, Welcome ${response.data.role}`, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        if (response.data.role === 'admin' || response.data.role === 'staff') {
          this.router.navigate(['/']);
        } else if (response.data.role === 'patient') {
          if (response.data.isFirstLogin) {
            this.router.navigate(['/update-password']);
          } else {
            this.router.navigate(['/']);
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
