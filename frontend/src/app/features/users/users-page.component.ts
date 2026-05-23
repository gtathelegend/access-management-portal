import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

import { AppCardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [AppCardComponent, PageHeaderComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {}
