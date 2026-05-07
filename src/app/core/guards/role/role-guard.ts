import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const currentRole = localStorage.getItem('role');

  if (currentRole === expectedRole) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
