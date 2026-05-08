import { Component,inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth/auth';
@Component({
  selector: 'app-register-patient',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register-patient.html',
  styleUrl: './register-patient.css',
})
export class RegisterPatient {
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill in all fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        this.snackBar.open('Account created successfully! Please login.', 'Close', {
          duration: 4000,
        });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Registration error:', err);
        this.snackBar.open(
          err.error?.message || 'Registration failed, please try again.',
          'Close',
          {
            duration: 4000,
            panelClass: ['error-snackbar'],
          },
        );
      },
    });
  }
}
