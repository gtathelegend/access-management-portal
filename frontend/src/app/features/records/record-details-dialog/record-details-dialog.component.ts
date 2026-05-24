import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AppButtonComponent } from '../../../shared/ui/button/button.component';
import { AppModalComponent } from '../../../shared/ui/modal/modal.component';
import type { VerificationRecord } from '../../../core/models/record.model';

export interface RecordDetailsDialogData {
  record: VerificationRecord;
  userLabel: string;
}

@Component({
  selector: 'app-record-details-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, MatDialogModule, AppButtonComponent, AppModalComponent],
  templateUrl: './record-details-dialog.component.html',
  styleUrl: './record-details-dialog.component.scss',
})
export class RecordDetailsDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<RecordDetailsDialogComponent>);
  readonly data = inject<RecordDetailsDialogData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}