import { Component, Inject, signal, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

export interface MoveTaskDialogData {
  currentListId: string;
  lists: { id: string; title: string }[];
}

@Component({
  selector: 'app-move-task-dialog',
  imports: [MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule, MatIcon],
  templateUrl: './move-task-dialog.component.html',
})
export class MoveTaskDialogComponent {
  //#region Properties
  data = inject(MAT_DIALOG_DATA) as { currentListId: string; lists: { id: string; title: string }[] };
  private dialogRef = inject(MatDialogRef<MoveTaskDialogComponent>);
  selectedListId = signal<string>(this.data.currentListId);
  //#endregion Properties

  //#region Dialogs
  onCancel() {
    this.dialogRef.close();
  }

  onMove() {
    this.dialogRef.close(this.selectedListId());
  }
  //#endregion Dialogs

  getSelectedListTitle(): string {
    const col = this.data.lists.find(c => c.id === this.selectedListId());
    if (!col) return '';
    return col.title + (col.id === this.data.currentListId ? ' (Current)' : '');
  }
}
