import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import {
  DsButton, DsDialogActions, DsDialogComponent, DsDialogContent, DsDialogTitle,
  DsFormField, DsInput, DsSelect,
} from '@pixeltraits/design-system';
import { TranslatePipe } from '@ngx-translate/core';
import { UsersService } from '../../application/users.service';
import type { CreateUserData, User, UserRole } from '../../domain/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    MatFormField, MatLabel, MatError,
    MatSelect, MatOption,
    DsFormField, DsInput, DsSelect, DsButton,
    DsDialogComponent, DsDialogTitle, DsDialogContent, DsDialogActions,
    TranslatePipe,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  private readonly usersService = inject(UsersService);
  private readonly dialogRef = inject(MatDialogRef<UserForm>);
  readonly user = inject<User | null>(MAT_DIALOG_DATA, { optional: true });
  readonly isEditMode = this.user !== null;

  readonly form = new FormGroup({
    firstname: new FormControl(this.user?.firstname ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    lastname: new FormControl(this.user?.lastname ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    email: new FormControl(this.user?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: this.isEditMode ? [] : [Validators.required, Validators.minLength(8), Validators.maxLength(255)],
    }),
    roles: new FormControl<UserRole>('user', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      if (this.isEditMode) {
        const { firstname, lastname, email } = this.form.getRawValue();
        await this.usersService.update({ id: this.user!.id, firstname, lastname, email });
      } else {
        await this.usersService.create(this.form.getRawValue() as CreateUserData);
      }
      this.dialogRef.close(true);
    } catch {
      this.error.set(
        this.isEditMode
          ? "Une erreur est survenue lors de la modification de l'utilisateur."
          : "Une erreur est survenue lors de la création de l'utilisateur.",
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
