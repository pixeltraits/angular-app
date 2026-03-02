import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, type TranslationObject } from '@ngx-translate/core';
import { forkJoin, map, type Observable } from 'rxjs';

const FEATURE_FILES = ['auth', 'nav', 'users'];

@Injectable()
export class MultiTranslateLoader implements TranslateLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<TranslationObject> {
    return forkJoin(
      FEATURE_FILES.map((file) =>
        this.http.get<TranslationObject>(`./i18n/${lang}/${file}.json`),
      ),
    ).pipe(map((results) => Object.assign({}, ...results)));
  }
}
