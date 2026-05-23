import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
