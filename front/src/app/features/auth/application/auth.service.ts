import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthRepositoryPort } from '../domain/auth-repository.port';
import { TokenStoragePort } from '../domain/token-storage.port';
import type { Credentials } from '../domain/auth.model';

interface JwtPayload {
  id: number;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authRepo = inject(AuthRepositoryPort);
  private readonly tokenStorage = inject(TokenStoragePort);

  readonly token = signal<string | null>(this.tokenStorage.get());

  private readonly decodedPayload = computed((): JwtPayload | null => {
    const token = this.token();
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)) as JwtPayload;
    } catch {
      return null;
    }
  });

  readonly isLoggedIn = computed(() => this.token() !== null);
  readonly isAdmin = computed(() => this.decodedPayload()?.roles?.includes('admin') ?? false);

  async login(credentials: Credentials): Promise<void> {
    const result = await this.authRepo.login(credentials);
    this.tokenStorage.save(result.token);
    this.token.set(result.token);
  }

  logout(): void {
    this.tokenStorage.clear();
    this.token.set(null);
  }
}
