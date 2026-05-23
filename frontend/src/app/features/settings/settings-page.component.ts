import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

import { AppCardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [AppCardComponent, PageHeaderComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {}
