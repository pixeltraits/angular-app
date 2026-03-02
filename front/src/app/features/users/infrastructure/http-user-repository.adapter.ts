import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserRepositoryPort } from '../domain/user-repository.port';
import type { CreateUserData, UpdateUserData, User } from '../domain/user.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpUserRepositoryAdapter extends UserRepositoryPort {
  private readonly http = inject(HttpClient);

  getAll(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${environment.apiUrl}/users`));
  }

  create(data: CreateUserData): Promise<User> {
    return firstValueFrom(this.http.post<User>(`${environment.apiUrl}/users`, data));
  }

  update(data: UpdateUserData): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${environment.apiUrl}/users/update-info`, data));
  }
}
