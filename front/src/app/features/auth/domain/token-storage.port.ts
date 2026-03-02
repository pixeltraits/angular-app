export abstract class TokenStoragePort {
  abstract save(token: string): void;
  abstract get(): string | null;
  abstract clear(): void;
}
