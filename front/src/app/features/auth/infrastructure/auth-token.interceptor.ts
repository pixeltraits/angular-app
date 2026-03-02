import { inject } from '@angular/core';
import { type HttpInterceptorFn } from '@angular/common/http';
import { TokenStoragePort } from '../domain/token-storage.port';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStoragePort);
  const token = tokenStorage.get();

  if (token) {
    return next(
      req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }),
    );
  }

  return next(req);
};
