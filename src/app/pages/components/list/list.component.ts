import { Component, input, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { List, Task, MoveTaskRequest } from '@shared/models/board.model';
import { BoardService } from '@shared/services/board.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskDialogComponent } from '@shared/dialogs/task-dialog/task-dialog.component';
import { ListDialogComponent } from '@shared/dialogs/list-dialog/list-dialog.component';
import { MoveListDialogComponent } from '@shared/dialogs/move-list-dialog/move-list-dialog.component';
import { distinctUntilChanged } from 'rxjs';
import { DeleteConfirmDialogComponent } from '@shared/dialogs/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-list',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, DragDropModule, TaskCardComponent],
  templateUrl: './list.component.html',
})
export class ListComponent {
  //#region Properties
  list = input.required<List>();
  allListIds = input<string[]>([]);
  isDraggingOverEmptyList = signal<boolean>(false);

  private boardService = inject(BoardService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  //#endregion Properties

  //#region Drag & Drop Handlers
  connectedLists(): string[] {
    // Return all list IDs except current list for cross-list drag and drop
    return this.allListIds().filter(id => id !== this.list().id);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Task moved within the same list - reorder the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      // Update the list's tasks array
      this.list().tasks = [...event.container.data];

      this.snackBar.open('Task reordered successfully', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } else {
      // Task moved to a different list
      const task = event.previousContainer.data[event.previousIndex];
      const sourceListId = event.previousContainer.id;
      const targetListId = event.container.id;

      const request: MoveTaskRequest = {
        taskId: task.id,
        sourceListId,
        targetListId,
        targetIndex: event.currentIndex,
      };

      this.boardService.moveTask(request);

      this.snackBar.open('Task moved successfully', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
  }

  onDropListEntered() {
    if (this.list().tasks.length === 0) {
      this.isDraggingOverEmptyList.set(true);
    }
  }

  onDropListExited() {
    this.isDraggingOverEmptyList.set(false);
  }
  //#endregion Drag & Drop Handlers

  //#region Dialogs
  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { mode: 'create', listTitle: this.list().title },
    });

    dialogRef
      .afterClosed()
      .pipe(distinctUntilChanged())
      .subscribe(result => {
        if (result) {
          this.boardService.createTask(this.list().id, {
            title: result.title,
            description: result.description,
            priority: result.priority,
          });
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
      });
  }

  openEditListDialog(): void {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        list: this.list(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(distinctUntilChanged())
      .subscribe(result => {
        if (result) {
          this.boardService.updateList({
            id: this.list().id,
            title: result.title,
          });
          this.snackBar.open('List updated successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
      });
  }

  openMoveListDialog(): void {
    // Get all lists and current index for the dialog
    const board = this.boardService.getCurrentBoard();
    const lists = board ? board.lists : [];
    const currentIndex = lists.findIndex(col => col.id === this.list().id);

    const dialogRef = this.dialog.open(MoveListDialogComponent, {
      width: '400px',
      data: {
        lists,
        currentIndex,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(distinctUntilChanged())
      .subscribe((newIndex: number | undefined) => {
        if (typeof newIndex === 'number' && newIndex !== currentIndex) {
          this.moveListToIndex(newIndex);
        }
      });
  }

  // Add this method to handle moving the list
  moveListToIndex(newIndex: number): void {
    this.boardService.moveList({
      listId: this.list().id,
      targetIndex: newIndex,
    });
    this.snackBar.open('List moved successfully', 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  deleteList(): void {
    const list = this.list();
    if (list.tasks && list.tasks.length > 0) {
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Delete List',
          message: 'This list contains tasks. Are you sure you want to delete the list and all its tasks? This action cannot be undone.',
          confirmText: 'Delete All',
          cancelText: 'Cancel',
        },
      });
      dialogRef.afterClosed().pipe(distinctUntilChanged()).subscribe(result => {
        if (result) {
          this.boardService.deleteList(list.id);
          this.snackBar.open('List and all its tasks deleted', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Delete List',
          message: 'Are you sure you want to delete this list?',
          confirmText: 'Delete',
          cancelText: 'Cancel',
        },
      });
      dialogRef.afterClosed().pipe(distinctUntilChanged()).subscribe(result => {
        if (result) {
          this.boardService.deleteList(list.id);
          this.snackBar.open('List deleted', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
      });
    }
  }
  //#endregion Dialogs

  //#region Helpers
  getTaskCount(): number {
    return this.list().tasks.length;
  }

  isTitleLong(): boolean {
    return this.list().title.length > 20;
  }

  getTitleTooltip(): string {
    return this.isTitleLong() ? this.list().title : '';
  }
  //#endregion Helpers
}
