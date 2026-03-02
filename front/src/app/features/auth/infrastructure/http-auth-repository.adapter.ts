import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthRepositoryPort } from '../domain/auth-repository.port';
import type { Credentials, AuthToken } from '../domain/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpAuthRepositoryAdapter extends AuthRepositoryPort {
  private readonly http = inject(HttpClient);

  login(credentials: Credentials): Promise<AuthToken> {
    return firstValueFrom(
      this.http.post<AuthToken>(`${environment.apiUrl}/connexion`, credentials),
    );
  }
}
