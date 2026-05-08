import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);

  sidebarOpen = true;
  currentRole = '';
  navItems: NavItem[] = [];
  roleLabel = '';
  roleBadgeClass = '';

  ngOnInit(): void {
    this.currentRole = this.authService.getRole() || '';
    this.setNavItems();
    this.setRoleInfo();
  }

  setNavItems() {
    if (this.currentRole === 'admin') {
      this.navItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-chart-pie', route: '/admin/dashboard' },
        { label: 'Profile', icon: 'fa-solid fa-user-shield', route: '/admin/profile' },
        { label: 'Staff', icon: 'fa-solid fa-user-tie', route: '/admin/staff' },
        { label: 'Patients', icon: 'fa-solid fa-hospital-user', route: '/admin/patients' },
        { label: 'Tests', icon: 'fa-solid fa-flask-vial', route: '/admin/tests' },
        { label: 'Booking', icon: 'fa-solid fa-calendar-check', route: '/admin/booking' },
        { label: 'Lab Settings', icon: 'fa-solid fa-gears', route: '/admin/settings' },
      ];
    } else if (this.currentRole === 'staff') {
      this.navItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', route: '/staff/dashboard' },
        { label: 'Profile', icon: 'fa-solid fa-user-doctor', route: '/staff/profile' },
        { label: 'Patients', icon: 'fa-solid fa-bed-pulse', route: '/staff/patients' },
        { label: 'Booking', icon: 'fa-solid fa-calendar-plus', route: '/staff/booking' },
      ];
    } else if (this.currentRole === 'patient') {
      this.navItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-house-medical', route: '/patient/dashboard' },
        { label: 'Profile', icon: 'fa-solid fa-address-card', route: '/patient/profile' },
        { label: 'Reports', icon: 'fa-solid fa-file-medical', route: '/patient/reports' },
      ];
    }
  }

  setRoleInfo() {
    if (this.currentRole === 'admin') {
      this.roleLabel = 'System Admin';
      this.roleBadgeClass = 'role-badge--admin';
    } else if (this.currentRole === 'staff') {
      this.roleLabel = 'Lab Staff';
      this.roleBadgeClass = 'role-badge--staff';
    } else if (this.currentRole === 'patient') {
      this.roleLabel = 'Patient';
      this.roleBadgeClass = 'role-badge--patient';
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
