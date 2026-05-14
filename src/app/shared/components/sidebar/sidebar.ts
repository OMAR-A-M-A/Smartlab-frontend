import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);

  sidebarOpen = true;
  isMobile = false;
  currentRole = '';
  navItems: NavItem[] = [];
  roleLabel = '';
  roleBadgeClass = '';

  ngOnInit(): void {
    this.currentRole = this.authService.getRole()?.toLowerCase().trim() || '';
    this.setNavItems();
    this.setRoleInfo();
    this.checkMobile();
  }

  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    // على الموبايل يبدأ مقفول
    if (this.isMobile) {
      this.sidebarOpen = false;
    } else {
      this.sidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // لما المستخدم يضغط على لينك في الموبايل يقفل السايدبار
  onNavClick(): void {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  setNavItems() {
    if (this.currentRole === 'admin') {
      this.navItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-chart-pie', route: '/admin/dashboard' },
        { label: 'Staff Accounts', icon: 'fa-solid fa-user-tie', route: '/admin/manage-staff' },
        { label: 'Patients & Results', icon: 'fa-solid fa-hospital-user', route: '/admin/manage-patients' },
        { label: 'Test References', icon: 'fa-solid fa-flask-vial', route: '/admin/test-references' },
        { label: 'Daily Schedule', icon: 'fa-solid fa-calendar-check', route: '/admin/schedule' },
        { label: 'Lab Reports', icon: 'fa-solid fa-file-medical', route: '/admin/reports' },
        { label: 'Critical Reports', icon: 'fa-solid fa-triangle-exclamation', route: '/admin/dangerous-reports' },
        { label: 'Lab Settings', icon: 'fa-solid fa-gears', route: '/admin/lab-settings' },
        { label: 'Account Settings', icon: 'fa-solid fa-user-shield', route: '/admin/settings' },
      ];
    } else if (this.currentRole === 'staff') {
      this.navItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', route: '/staff/dashboard' },
        { label: 'Daily Schedule', icon: 'fa-solid fa-calendar-day', route: '/staff/schedule' },
        { label: 'Patients & Results', icon: 'fa-solid fa-bed-pulse', route: '/staff/manage-patients' },
        { label: 'Lab Reports', icon: 'fa-solid fa-file-waveform', route: '/staff/reports' },
        { label: 'My Profile', icon: 'fa-solid fa-user-doctor', route: '/staff/settings' },
      ];
    } else if (this.currentRole === 'patient') {
      this.navItems = [
        { label: 'Dashboard', icon: 'fa-solid fa-house-medical', route: '/patient/dashboard' },
        { label: 'My Appointments', icon: 'fa-solid fa-calendar-check', route: '/patient/my-appointments' },
        { label: 'Lab Reports', icon: 'fa-solid fa-file-medical', route: '/patient/reports' },
        { label: 'My Profile', icon: 'fa-solid fa-address-card', route: '/patient/profile' },
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
