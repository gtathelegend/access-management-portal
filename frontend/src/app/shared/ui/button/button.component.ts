import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      class="btn"
      [class]="'btn-' + variant"
      [class.btn-loading]="loading"
      [class.btn-icon-only]="iconOnly"
      (click)="onClick($event)"
    >
      <span class="btn-content" *ngIf="!loading">
        <ng-content></ng-content>
      </span>
      <span class="spinner" *ngIf="loading"></span>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 var(--space-normal);
      height: 40px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 1px solid transparent;
      gap: var(--space-small);
      white-space: nowrap;
      outline: none;
      position: relative;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--accent-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }

    .btn-secondary {
      background: var(--bg-hover);
      color: var(--text-primary);
      border-color: var(--border-subtle);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--border-subtle);
      border-color: var(--border-strong);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .btn-danger {
      background: var(--accent-danger);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }

    .btn-icon-only {
      width: 40px;
      padding: 0;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      animation: rotation 0.6s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: inherit;
    }
  `]
})
export class AppButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'secondary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() iconOnly = false;
  @Output() btnClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
