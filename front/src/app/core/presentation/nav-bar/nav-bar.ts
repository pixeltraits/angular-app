import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DsIcon } from '@pixeltraits/design-system';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, DsIcon, TranslatePipe],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  readonly isAdmin = input<boolean>(false);
  readonly logoutClick = output<void>();
}
