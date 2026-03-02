import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { DsButton, DsFormField, DsIcon, DsInput } from '@pixeltraits/design-system';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../application/auth.service';
import type { Credentials } from '../../domain/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatError, MatSuffix, DsFormField, DsInput, DsButton, DsIcon, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authService.login(this.form.getRawValue() as Credentials);
      this.router.navigate(['/dashboard']);
    } catch {
      this.error.set('Email ou mot de passe incorrect.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
