import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-records-page',
  standalone: true,
  imports: [MatCardModule, PageHeaderComponent],
  templateUrl: './records-page.component.html',
  styleUrl: './records-page.component.scss',
})
export class RecordsPageComponent {}
