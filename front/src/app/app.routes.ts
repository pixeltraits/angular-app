import { Routes } from '@angular/router';
import { authGuard } from '@features/auth/application/auth.guard';
import { adminGuard } from '@features/auth/application/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout').then((m) => m.Layout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/dashboard/presentation/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('@features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
    ],
  },
];
