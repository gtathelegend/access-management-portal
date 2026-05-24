import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="app-button"
      [type]="type"
      [disabled]="disabled || loading"
      [class.app-button--primary]="variant === 'primary'"
      [class.app-button--secondary]="variant === 'secondary'"
      [class.app-button--ghost]="variant === 'ghost'"
      [class.app-button--danger]="variant === 'danger'"
      [class.app-button--loading]="loading"
      [class.app-button--icon-only]="iconOnly"
      [class.app-button--block]="block"
      [class.app-button--sm]="size === 'sm'"
      [class.app-button--lg]="size === 'lg'"
      (click)="onClick($event)"
      [attr.aria-busy]="loading"
    >
      <span class="button-content" *ngIf="!loading">
        <ng-content></ng-content>
      </span>
      <span class="spinner" *ngIf="loading" aria-hidden="true"></span>
    </button>
  `,
  styles: [`
    .app-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-small);
      padding: 0 16px;
      height: var(--control-height);
      border-radius: 14px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: transform var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
      border: 1px solid transparent;
      white-space: nowrap;
      outline: none;
      position: relative;
      color: var(--text-primary);
      background: var(--bg-surface);
      box-shadow: var(--shadow-sm);
    }

    .app-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .app-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .app-button--primary {
      background: var(--accent-primary);
      color: white;
    }

    .app-button--primary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--accent-primary) 88%, black);
    }

    .app-button--secondary {
      background: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-hover));
      color: var(--text-primary);
      border-color: var(--border-subtle);
    }

    .app-button--secondary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--bg-hover) 72%, var(--bg-surface));
      border-color: var(--border-strong);
    }

    .app-button--ghost {
      background: transparent;
      color: var(--text-secondary);
      border-color: transparent;
      box-shadow: none;
    }

    .app-button--ghost:hover:not(:disabled) {
      background: color-mix(in srgb, var(--bg-hover) 88%, transparent);
      color: var(--text-primary);
    }

    .app-button--danger {
      background: var(--accent-danger);
      color: white;
    }

    .app-button--danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--accent-danger) 86%, black);
    }

    .app-button--icon-only {
      width: var(--control-height);
      padding: 0;
      border-radius: 9999px;
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

    .button-content {
      display: flex;
      align-items: center;
      gap: inherit;
    }

    .app-button--sm {
      height: var(--control-height-compact);
      padding: 0 12px;
      border-radius: 12px;
      font-size: 13px;
    }

    .app-button--lg {
      height: 48px;
      padding: 0 18px;
      border-radius: 16px;
      font-size: 15px;
    }

    .app-button--block {
      width: 100%;
    }
  `]
})
export class AppButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'secondary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() iconOnly = false;
  @Input() block = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() btnClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
