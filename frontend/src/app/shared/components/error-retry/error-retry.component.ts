import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-error-retry',
  standalone: true,
  imports: [CommonModule, MatIconModule, AppButtonComponent],
  templateUrl: './error-retry.component.html',
  styleUrl: './error-retry.component.scss',
})
export class ErrorRetryComponent {
  @Input() title = 'Connection issue';
  @Input() description = 'We could not complete the request. You can retry without losing your current view.';
  @Input() errorMessage: string | null = null;
  @Output() retry = new EventEmitter<void>();
}
