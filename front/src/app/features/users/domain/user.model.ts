export type UserRole = 'admin' | 'user' | 'public';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: UserRole;
}

export interface CreateUserData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: UserRole;
}

export interface UpdateUserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}
