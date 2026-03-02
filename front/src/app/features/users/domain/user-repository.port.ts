import type { User, CreateUserData, UpdateUserData } from './user.model';

export abstract class UserRepositoryPort {
  abstract getAll(): Promise<User[]>;
  abstract create(data: CreateUserData): Promise<User>;
  abstract update(data: UpdateUserData): Promise<User>;
}
