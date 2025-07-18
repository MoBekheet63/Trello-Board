import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { List } from '@shared/models/board.model';

export interface ListDialogData {
  mode: 'create' | 'edit';
  list?: List;
}

export interface ListDialogResult {
  title: string;
}

@Component({
  selector: 'app-list-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './list-dialog.component.html',
})
export class ListDialogComponent implements OnInit {
  //#region Properties
  listForm: FormGroup;
  data = inject(MAT_DIALOG_DATA) as ListDialogData;
  isEditMode = signal<boolean>(false);

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ListDialogComponent>);
  //#endregion Properties

  //#region Lifecycle
  constructor() {
    this.isEditMode.set(this.data.mode === 'edit');
    this.listForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode() && this.data.list) {
      this.listForm.patchValue({
        title: this.data.list.title,
      });
    }
  }
  //#endregion Lifecycle

  //#region Dialogs
  onSubmit(): void {
    if (this.listForm.valid) {
      const result: ListDialogResult = {
        title: this.listForm.value.title.trim(),
      };
      this.dialogRef.close(result);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  //#endregion Dialogs

  //#region Helpers
  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.listForm.controls).forEach(key => {
      const control = this.listForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(): string {
    const control = this.listForm.get('title');
    if (control?.hasError('required')) {
      return 'List title is required';
    }
    if (control?.hasError('minlength')) {
      return 'List title must be at least 1 character long';
    }
    if (control?.hasError('maxlength')) {
      return 'List title cannot exceed 50 characters';
    }
    return '';
  }

  getDialogTitle(): string {
    return this.isEditMode() ? 'Edit List' : 'Create New List';
  }

  getSubmitButtonText(): string {
    return this.isEditMode() ? 'Update List' : 'Create List';
  }
  //#endregion Helpers
}
