import { Component, input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Task } from '@shared/models/board.model';
import { BoardService } from '@shared/services/board.service';
import { TaskDialogComponent } from '@shared/dialogs/task-dialog/task-dialog.component';
import { distinctUntilChanged } from 'rxjs';
import { MoveTaskDialogComponent } from '@shared/dialogs/move-task-dialog/move-task-dialog.component';
import { MoveTaskRequest } from '@shared/models/board.model';
import { TaskViewDialogComponent } from '@shared/dialogs/task-view-dialog/task-view-dialog.component';
import { DeleteConfirmDialogComponent } from '@shared/dialogs/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  //#region Properties
  task = input.required<Task>();
  listId = input.required<string>();

  private boardService = inject(BoardService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  //#endregion Properties

  //#region Dialogs
  openEditTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        task: this.task(),
        listTitle: this.getListTitle(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(distinctUntilChanged())
      .subscribe(result => {
        if (result) {
          this.boardService.updateTask(this.listId(), {
            id: this.task().id,
            title: result.title,
            description: result.description,
            priority: result.priority,
          });
          this.snackBar.open('Task updated successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
      });
  }

  deleteTask(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.deleteTask(this.listId(), this.task().id);
        this.snackBar.open('Task deleted', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  openMoveTaskDialog(): void {
    const board = this.boardService.getCurrentBoard();
    if (!board) return;
    const lists = board.lists.map(col => ({ id: col.id, title: col.title }));
    const dialogRef = this.dialog.open(MoveTaskDialogComponent, {
      width: '400px',
      data: {
        currentListId: this.listId(),
        lists,
      },
    });
    dialogRef.afterClosed().subscribe((targetListId: string) => {
      if (targetListId && targetListId !== this.listId()) {
        // Move to end of target list
        const targetList = board.lists.find(col => col.id === targetListId);
        const targetIndex = targetList ? targetList.tasks.length : 0;
        const request: MoveTaskRequest = {
          taskId: this.task().id,
          sourceListId: this.listId(),
          targetListId,
          targetIndex,
        };
        this.boardService.moveTask(request);
        this.snackBar.open('Task moved successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  openViewTaskDialog(): void {
    this.dialog.open(TaskViewDialogComponent, {
      width: '500px',
      data: {
        ...this.task(),
        listTitle: this.getListTitle(),
      },
    });
  }
  //#endregion Dialogs

  //#region Helpers
  getListTitle(): string {
    const board = this.boardService.getCurrentBoard();
    if (!board) return '';
    const col = board.lists.find(c => c.id === this.listId());
    return col ? col.title : '';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  hasDescription(): boolean {
    return !!(this.task().description && this.task().description?.trim());
  }

  isTitleLong(): boolean {
    return this.task().title.length > 30;
  }

  getTitleTooltip(): string {
    return this.isTitleLong() ? this.task().title : '';
  }
  //#endregion Helpers
}
