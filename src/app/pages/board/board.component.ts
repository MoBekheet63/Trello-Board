import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Board, List, MoveListRequest } from '@shared/models/board.model';
import { BoardService } from '@shared/services/board.service';
import { ListComponent } from '../components/list/list.component';
import { ListDialogComponent } from '@shared/dialogs/list-dialog/list-dialog.component';

@Component({
  selector: 'app-board',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, DragDropModule, ListComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnDestroy {
  
  //#region Properties
  board = signal<Board | null>(null);
  loading = signal<boolean>(true);
  listIds = signal<string[]>([]);

  private destroy$ = new Subject<void>();
  private boardService = inject(BoardService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  //#endregion Properties

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.boardService
      .getBoard()
      .pipe(takeUntil(this.destroy$))
      .subscribe(board => {
        this.board.set(board);
        this.listIds.set(board?.lists.map(col => col.id) || []);
        this.loading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion Lifecycle Hooks

  //#region Event Handlers
  onListDrop(event: CdkDragDrop<List[]>): void {
    if (!this.board()) return;

    if (event.previousIndex !== event.currentIndex) {
      const listId = this.board()?.lists[event.previousIndex].id!;

      const request: MoveListRequest = {
        listId,
        targetIndex: event.currentIndex,
      };

      this.boardService.moveList(request);

      this.snackBar.open('List moved successfully', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
  }

  openAddListDialog(): void {
    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '400px',
      data: { mode: 'create' },
    });

    dialogRef
      .afterClosed()
      .pipe(distinctUntilChanged())
      .subscribe(result => {
        if (result) {
          this.boardService.createList({ title: result.title });
          this.snackBar.open('List created successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
      });
  }
  //#endregion Event Handlers

}
