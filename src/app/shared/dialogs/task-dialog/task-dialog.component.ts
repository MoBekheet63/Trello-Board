import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Task } from '@shared/models/board.model';

export interface TaskDialogData {
  mode: 'create' | 'edit';
  task?: Task;
  listTitle?: string;
}

export interface TaskDialogResult {
  title: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent implements OnInit {
  //#region Properties
  taskForm: FormGroup;
  data = inject(MAT_DIALOG_DATA) as TaskDialogData;
  isEditMode = signal<boolean>(false);

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  //#endregion Properties

  //#region Lifecycle
  constructor() {
    this.isEditMode.set(this.data.mode === 'edit');
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode() && this.data.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        priority: this.data.task.priority,
      });
    }
  }
  //#endregion Lifecycle

  //#region Dialogs
  onSubmit(): void {
    if (this.taskForm.valid) {
      const result: TaskDialogResult = {
        title: this.taskForm.value.title.trim(),
        description: this.taskForm.value.description?.trim() || '',
        priority: this.taskForm.value.priority,
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
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: [''],
      priority: ['medium', Validators.required],
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is too short`;
    }
    if (control?.hasError('maxlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is too long`;
    }
    return '';
  }
  //#endregion Helpers

  getDialogTitle(): string {
    return this.isEditMode() ? 'Edit Task' : 'Create New Task';
  }

  getSubmitButtonText(): string {
    return this.isEditMode() ? 'Update Task' : 'Create Task';
  }

  isListTitleLong(): boolean {
    return !!(this.data.listTitle && this.data.listTitle.length > 25);
  }

  getListTitleTooltip(): string {
    return this.isListTitleLong() ? this.data.listTitle || '' : '';
  }
}
