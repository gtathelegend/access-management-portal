import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [MatCardModule, PageHeaderComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent {}
