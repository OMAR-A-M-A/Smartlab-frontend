import { Component,inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(Auth);
  router = inject(Router);

  get userRole(): string | null {
    return this.authService.getRole();
  }

  get userName(): string | null {
    return this.authService.getUserName();
  }

  get profileImage(): string {
    const gender = this.authService.getUserGender();
    return gender === 'female'
      ? '/images/female-avatar.png'
      : '/images/male-avatar.png';
  }

  navigateToDashboard() {
    const role = this.userRole;
    if (role === 'patient') {
      this.router.navigate(['/patient/reports']);
    } else if (role === 'admin' || role === 'staff') {
      this.router.navigate([`/${role}/dashboard`]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
