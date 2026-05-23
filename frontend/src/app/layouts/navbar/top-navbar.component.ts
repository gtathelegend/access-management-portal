import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [NgIf, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss',
})
export class TopNavbarComponent {
  private readonly themeService = inject(ThemeService);

  @Input() showMenuButton = false;
  @Output() menuToggle = new EventEmitter<void>();

  readonly themeMode = this.themeService.mode;

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
