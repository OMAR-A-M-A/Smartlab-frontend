import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';
import { roleGuard } from './core/guards/role/role-guard';

export const routes: Routes = [
  // ==========================================
  // (Public & Auth Routes)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./features/landing-page/landing-page').then((c) => c.LandingPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register-patient/register-patient').then((c) => c.RegisterPatient),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((c) => c.ForgotPassword),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then((c) => c.ResetPassword),
  },

  {
    path: 'change-password',
    loadComponent: () =>
      import('./features/auth/change-password/change-password').then((c) => c.ChangePassword),
    canActivate: [authGuard],
  },

  // ==========================================
  // (Patient Routes)
  // ==========================================
  {
    path: 'patient',
    canActivate: [authGuard, roleGuard],
    data: { role: 'patient' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/patient/patient-dashboard/patient-dashboard').then(
            (c) => c.PatientDashboard,
          ),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/patient/profile/profile').then((c) => c.Profile),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/patient/appointments/appointments').then((c) => c.Appointments),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/patient/my-reports/my-reports').then((c) => c.MyReports),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // ==========================================
  // (Staff Routes)
  // ==========================================
  {
    path: 'staff',
    canActivate: [authGuard, roleGuard],
    data: { role: 'staff' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/staff/staff-dashboard/staff-dashboard').then((c) => c.StaffDashboard),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/staff/daily-schedule/daily-schedule').then((c) => c.DailySchedule),
      },
      {
        path: 'manage-patients',
        loadComponent: () =>
          import('./features/staff/manage-patients/manage-patients').then((c) => c.ManagePatients),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/staff/reports/reports').then((c) => c.Reports),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // ==========================================
  // (Admin Routes)
  // ==========================================
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
      },
      {
        path: 'manage-staff',
        loadComponent: () =>
          import('./features/admin/manage-staff/manage-staff').then((c) => c.ManageStaff),
      },
      {
        path: 'lab-settings',
        loadComponent: () =>
          import('./features/admin/lab-settings/lab-settings').then((c) => c.LabSettings),
      },
      {
        path: 'test-references',
        loadComponent: () =>
          import('./features/admin/test-references/test-references').then((c) => c.TestReferences),
      },
      {
        path: 'dangerous-reports',
        loadComponent: () =>
          import('./features/admin/dangerous-reports/dangerous-reports').then(
            (c) => c.DangerousReports,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((c) => c.NotFound),
  },
];