import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavBar } from './core/presentation/nav-bar/nav-bar';
import { AuthService } from '@features/auth/application/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavBar],
  template: `
    <app-nav-bar [isAdmin]="authService.isAdmin()" (logoutClick)="logout()" />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
