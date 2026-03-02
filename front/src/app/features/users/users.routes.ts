import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/users-list/users-list').then((m) => m.UsersList),
  },
];
