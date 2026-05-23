import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() borderRadius = '4px';
  @Input() margin = '10px 0';
  @Input() appearance: 'text' | 'circle' | 'rectangle' = 'text';

  get styles() {
    return {
      'width': this.appearance === 'circle' ? this.height : this.width,
      'height': this.height,
      'border-radius': this.appearance === 'circle' ? '50%' : this.borderRadius,
      'margin': this.margin
    };
  }
}
