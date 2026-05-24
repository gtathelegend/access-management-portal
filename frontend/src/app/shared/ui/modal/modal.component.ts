import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="modal-shell" [class.modal-shell--compact]="compact">
      <header class="modal-header" *ngIf="title || subtitle || icon">
        <div class="modal-icon" *ngIf="icon">
          <span class="material-icons">{{ icon }}</span>
        </div>
        <div class="modal-copy">
          <div class="modal-title" *ngIf="title">{{ title }}</div>
          <div class="modal-subtitle" *ngIf="subtitle">{{ subtitle }}</div>
        </div>
      </header>

      <div class="modal-body">
        <ng-content></ng-content>
      </div>

      <footer class="modal-footer" *ngIf="hasFooter">
        <ng-content select="[modalFooter]"></ng-content>
      </footer>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .modal-shell {
      display: grid;
      gap: var(--space-section);
      padding: var(--space-section);
      width: min(100%, 720px);
      max-width: calc(100vw - 24px);
    }

    .modal-shell--compact {
      gap: var(--space-normal);
      padding: var(--space-normal);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .modal-icon {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--accent-primary) 12%, var(--bg-surface));
      color: var(--accent-primary);
      flex-shrink: 0;
    }

    .modal-icon .material-icons {
      font-size: 20px;
    }

    .modal-copy {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .modal-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .modal-body {
      min-width: 0;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: var(--space-normal);
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }

    @media (max-width: 599.98px) {
      .modal-shell {
        padding: var(--space-normal);
        max-width: 100vw;
      }

      .modal-header {
        align-items: center;
      }

      .modal-footer {
        justify-content: flex-start;
      }

      .modal-footer > * {
        flex: 1 1 100%;
      }
    }
  `]
})
export class AppModalComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() compact = false;
  @Input() hasFooter = true;
}