import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DsButton, DsIcon } from '@pixeltraits/design-system';
import { AuthService } from '@features/auth/application/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DsButton, DsIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="dashboard">
      <h1>Dashboard</h1>

      @if (authService.isAdmin()) {
        <div class="actions">
          <a dsButton="primary" routerLink="/users">
            <ds-icon icon="plus" />
            Créer un utilisateur
          </a>
        </div>
      }
    </main>
  `,
  styles: `
    .dashboard {
      padding: 2rem;
    }

    .actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.75rem;
    }
  `,
})
export class Dashboard {
  protected readonly authService = inject(AuthService);
}
