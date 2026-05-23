import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-retry',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './error-retry.component.html',
  styleUrl: './error-retry.component.scss',
})
export class ErrorRetryComponent {
  @Input() title = 'Something went wrong';
  @Input() description = 'We could not complete the request right now. Try again in a moment.';
  @Input() errorMessage: string | null = null;
  @Output() retry = new EventEmitter<void>();
}
