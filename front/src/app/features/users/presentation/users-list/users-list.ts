import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  DsButton, DsDialog, DsIcon,
  DsResponsiveTable, DsResponsiveTableContainer,
  DsResponsiveTableTh, DsResponsiveTableTd,
} from '@pixeltraits/design-system';
import { TranslatePipe } from '@ngx-translate/core';
import { UsersService } from '../../application/users.service';
import { UserForm } from '../user-form/user-form';
import type { User } from '../../domain/user.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [
    DsButton, DsIcon,
    DsResponsiveTable, DsResponsiveTableContainer,
    DsResponsiveTableTh, DsResponsiveTableTd,
    TranslatePipe,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersList {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(DsDialog);

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadUsers();
  }

  openCreateDialog(): void {
    this.dialog.open(UserForm, { data: null })
      .afterClosed()
      .pipe(take(1))
      .subscribe({ next: result => { if (result) this.loadUsers(); } });
  }

  openEditDialog(user: User): void {
    this.dialog.open(UserForm, { data: user })
      .afterClosed()
      .pipe(take(1))
      .subscribe({ next: result => { if (result) this.loadUsers(); } });
  }

  private async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const users = await this.usersService.getAll();
      this.users.set(users);
    } catch {
      this.error.set('Impossible de charger les utilisateurs.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
