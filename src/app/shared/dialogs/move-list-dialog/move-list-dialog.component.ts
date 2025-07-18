import { Component, signal, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-move-list-dialog',
  imports: [MatButtonModule, MatSelectModule, MatFormFieldModule, MatIconModule, FormsModule],
  template: `
    <div class="w-full max-w-xs md:min-w-[350px] md:max-w-[90vw] max-h-[90vh] overflow-y-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
      <div class="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-4 !m-0">
          <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <mat-icon class="text-white text-2xl">swap_horiz</mat-icon>
          </div>
          Move List
        </h2>
      </div>

      <div class="p-8">
        <div>
          <label class="block text-base font-semibold text-gray-700 mb-3">Move to position:</label>
          <mat-form-field appearance="outline" class="w-full">
            <mat-select [(ngModel)]="selectedIndex" class="text-base">
              @for (col of data.lists; track col.id) {
                <mat-option [value]="$index" [disabled]="$index === data.currentIndex">
                  Position {{ $index + 1 }}{{ $index === data.currentIndex ? ' (Current)' : '' }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="flex justify-end gap-4 p-8 border-t border-gray-100 bg-gray-50">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          class="px-8 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2 normal-case">
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          (click)="onMove()"
          [disabled]="selectedIndex() === data.currentIndex"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2 normal-case">
          <mat-icon>swap_horiz</mat-icon>
          Move List
        </button>
      </div>
    </div>
  `,
})
export class MoveListDialogComponent {
  //#region Properties
  data = inject(MAT_DIALOG_DATA) as { lists: any[]; currentIndex: number };
  private dialogRef = inject(MatDialogRef<MoveListDialogComponent>);
  selectedIndex = signal<number>(this.data.currentIndex);
  //#endregion Properties

  //#region Dialogs
  onCancel() {
    this.dialogRef.close();
  }

  onMove() {
    this.dialogRef.close(this.selectedIndex());
  }
  //#endregion Dialogs
}
