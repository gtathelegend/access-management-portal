import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper" [class.has-icon]="icon">
      <span class="icon" *ngIf="icon">{{ icon }}</span>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onBlur()"
        class="input-field"
        [class.pill]="pill"
      />
    </div>
  `,
  styles: [`
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .input-field {
      width: 100%;
      height: 40px;
      padding: 0 var(--space-normal);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      color: var(--text-primary);
      font-size: 14px;
      transition: all var(--transition-fast);
      outline: none;
    }

    .input-field:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    .input-field.pill {
      border-radius: var(--radius-pill);
    }

    .input-wrapper.has-icon .input-field {
      padding-left: 40px;
    }

    .icon {
      position: absolute;
      left: var(--space-normal);
      color: var(--text-muted);
      font-family: 'Material Icons';
      font-size: 20px;
      pointer-events: none;
    }
  `]
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() icon?: string;
  @Input() pill = false;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
