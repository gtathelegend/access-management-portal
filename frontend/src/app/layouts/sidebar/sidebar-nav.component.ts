import { Component, Input, inject } from '@angular/core';
import { NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { AuthService } from '../../core/services/auth.service';
import { NavItem } from '../../core/models/nav-item.model';
import { SkeletonSidebarComponent } from '../../shared/components/skeleton-sidebar/skeleton-sidebar.component';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [NgIf, TitleCasePipe, RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule, SkeletonSidebarComponent],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  private readonly authService = inject(AuthService);

  @Input() collapsed = false;

  readonly user = this.authService.currentUser;

  readonly items: NavItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'group', route: '/users' },
    { label: 'Records', icon: 'badge', route: '/records' },
    { label: 'Analytics', icon: 'query_stats', route: '/analytics' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  readonly workspaceStats = [
    { label: 'Approvals', value: '18', tone: 'primary' },
    { label: 'Pending', value: '4', tone: 'warning' },
  ];

  get avatarLabel(): string {
    const name = this.user()?.name?.trim();
    if (!name) {
      return 'A';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
