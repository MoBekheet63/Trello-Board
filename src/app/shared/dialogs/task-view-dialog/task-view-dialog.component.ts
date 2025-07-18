import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-task-view-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, DatePipe, NgTemplateOutlet],
  templateUrl: './task-view-dialog.component.html',
})
export class TaskViewDialogComponent {
  //#region Properties
  data = inject(MAT_DIALOG_DATA) as any;
  dialogRef = inject(MatDialogRef<TaskViewDialogComponent>);
  //#endregion Properties

  //#region Dialogs
  close(): void {
    this.dialogRef.close();
  }
  //#endregion Dialogs

  //#region Helpers
  isListTitleLong(): boolean {
    return !!(this.data.listTitle && this.data.listTitle.length > 25);
  }

  getListTitleTooltip(): string {
    return this.isListTitleLong() ? this.data.listTitle || '' : '';
  }
  //#endregion Helpers
}
