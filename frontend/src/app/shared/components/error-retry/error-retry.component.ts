import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-retry',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container" *ngIf="errorMessage">
      <mat-icon color="warn">error_outline</mat-icon>
      <p class="error-message">{{ errorMessage }}</p>
      <button mat-stroked-button color="primary" (click)="retry.emit()">
        <mat-icon>refresh</mat-icon>
        Retry
      </button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      border: 1px dashed #f44336;
      border-radius: 8px;
      margin: 1rem 0;
      background: #fff8f8;
    }
    .error-message {
      margin: 1rem 0;
      color: #333;
      font-weight: 500;
    }
    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
  `]
})
export class ErrorRetryComponent {
  @Input() errorMessage: string | null = null;
  @Output() retry = new EventEmitter<void>();
}
