import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { MultiTranslateLoader } from './core/infrastructure/multi-translate-loader.adapter';

import { routes } from './app.routes';
import { AuthRepositoryPort } from '@features/auth/domain/auth-repository.port';
import { TokenStoragePort } from '@features/auth/domain/token-storage.port';
import { HttpAuthRepositoryAdapter } from '@features/auth/infrastructure/http-auth-repository.adapter';
import { LocalStorageTokenAdapter } from '@features/auth/infrastructure/local-storage-token.adapter';
import { authTokenInterceptor } from '@features/auth/infrastructure/auth-token.interceptor';
import { UserRepositoryPort } from '@features/users/domain/user-repository.port';
import { HttpUserRepositoryAdapter } from '@features/users/infrastructure/http-user-repository.adapter';
import { UsersService } from '@features/users/application/users.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideTranslateService({
      defaultLanguage: 'fr',
      loader: { provide: TranslateLoader, useClass: MultiTranslateLoader },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (translate: TranslateService) => () => firstValueFrom(translate.use('fr')),
      deps: [TranslateService],
      multi: true,
    },
    { provide: AuthRepositoryPort, useClass: HttpAuthRepositoryAdapter },
    { provide: TokenStoragePort, useClass: LocalStorageTokenAdapter },
    { provide: UserRepositoryPort, useClass: HttpUserRepositoryAdapter },
    UsersService,
  ],
};
