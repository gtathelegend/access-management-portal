import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
  template: `
    <label class="input-shell">
      <span class="input-label" *ngIf="label">{{ label }}</span>
      <div class="input-wrapper" [class.has-icon]="icon">
        <span class="icon material-icons" *ngIf="icon">{{ icon }}</span>
        <input
          class="input-field"
          [class.input-field--pill]="pill"
          [class.input-field--sm]="size === 'sm'"
          [class.input-field--lg]="size === 'lg'"
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          [attr.aria-invalid]="invalid"
        />
      </div>
      <span class="input-hint" *ngIf="helperText && !invalid">{{ helperText }}</span>
      <span class="input-error" *ngIf="invalid && errorText">{{ errorText }}</span>
    </label>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .input-shell {
      display: grid;
      gap: 8px;
      width: 100%;
    }

    .input-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .input-field {
      width: 100%;
      height: var(--control-height);
      padding: 0 14px;
      border-radius: 14px;
      border: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-hover));
      color: var(--text-primary);
      font-size: 14px;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast);
      outline: none;
    }

    .input-field:focus {
      border-color: color-mix(in srgb, var(--accent-primary) 42%, var(--border-subtle));
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent-primary) 10%, transparent);
      background: var(--bg-surface);
    }

    .input-field--pill {
      border-radius: var(--radius-pill);
    }

    .input-wrapper.has-icon .input-field {
      padding-left: 42px;
    }

    .icon {
      position: absolute;
      left: 14px;
      color: var(--text-muted);
      font-size: 18px;
      pointer-events: none;
      line-height: 1;
    }

    .input-field--sm {
      height: var(--control-height-compact);
      font-size: 13px;
    }

    .input-field--lg {
      height: 48px;
      font-size: 15px;
    }

    .input-hint,
    .input-error {
      font-size: 12px;
      line-height: 1.4;
    }

    .input-hint {
      color: var(--text-muted);
    }

    .input-error {
      color: var(--accent-danger);
    }
  `],
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() icon?: string;
  @Input() pill = false;
  @Input() label?: string;
  @Input() helperText?: string;
  @Input() errorText?: string;
  @Input() invalid = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}