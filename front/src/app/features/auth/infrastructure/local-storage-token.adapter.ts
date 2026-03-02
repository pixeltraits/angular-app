import { Injectable } from '@angular/core';
import { TokenStoragePort } from '../domain/token-storage.port';

@Injectable()
export class LocalStorageTokenAdapter extends TokenStoragePort {
  private readonly KEY = 'auth_token';

  save(token: string): void {
    localStorage.setItem(this.KEY, token);
  }

  get(): string | null {
    return localStorage.getItem(this.KEY);
  }

  clear(): void {
    localStorage.removeItem(this.KEY);
  }
}
