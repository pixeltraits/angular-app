import { Injectable, inject } from '@angular/core';
import { UserRepositoryPort } from '../domain/user-repository.port';
import type { CreateUserData, UpdateUserData, User } from '../domain/user.model';

@Injectable()
export class UsersService {
  private readonly userRepo = inject(UserRepositoryPort);

  getAll(): Promise<User[]> {
    return this.userRepo.getAll();
  }

  create(data: CreateUserData): Promise<User> {
    return this.userRepo.create(data);
  }

  update(data: UpdateUserData): Promise<User> {
    return this.userRepo.update(data);
  }
}
