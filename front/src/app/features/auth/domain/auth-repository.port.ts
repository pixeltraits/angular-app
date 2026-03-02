import type { Credentials } from './auth.model';
import type { AuthToken } from './auth.model';

export abstract class AuthRepositoryPort {
  abstract login(credentials: Credentials): Promise<AuthToken>;
}
