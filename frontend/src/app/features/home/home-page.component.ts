import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AppButtonComponent } from '../../shared/ui/button/button.component';
import { AppCardComponent } from '../../shared/ui/card/card.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, AppButtonComponent, AppCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  goToApp(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
