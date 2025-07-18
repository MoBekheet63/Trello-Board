import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Board,
  List,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateListRequest,
  UpdateListRequest,
  MoveTaskRequest,
  MoveListRequest,
} from '../models/board.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  //#region Properties
  private readonly BOARD_KEY = 'trello_board';
  private boardSubject = new BehaviorSubject<Board | null>(null);
  public board$ = this.boardSubject.asObservable();

  private storageService = inject(StorageService);
  //#endregion Properties

  //#region Constructor
  constructor() {
    this.loadBoard();
  }
  //#endregion Constructor

  //#region Board Loading
  private loadBoard(): void {
    const savedBoard = this.storageService.getItem<Board>(this.BOARD_KEY);

    if (savedBoard) {
      // Convert date strings back to Date objects
      savedBoard.createdAt = new Date(savedBoard.createdAt);
      savedBoard.updatedAt = new Date(savedBoard.updatedAt);
      savedBoard.lists.forEach(list => {
        list.createdAt = new Date(list.createdAt);
        list.updatedAt = new Date(list.updatedAt);
        list.tasks.forEach(task => {
          task.createdAt = new Date(task.createdAt);
          task.updatedAt = new Date(task.updatedAt);
        });
      });
      this.boardSubject.next(savedBoard);
    } else {
      this.initializeDefaultBoard();
    }
  }

  private initializeDefaultBoard(): void {
    const now = new Date();
    const defaultBoard: Board = {
      id: this.generateId(),
      title: 'My Trello Board',
      lists: [],
      createdAt: now,
      updatedAt: now,
    };

    this.saveBoard(defaultBoard);
  }

  private saveBoard(board: Board): void {
    board.updatedAt = new Date();
    this.storageService.setItem(this.BOARD_KEY, board);
    this.boardSubject.next(board);
  }
  //#endregion Board Loading

  //#region Helpers
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  //#endregion Helpers

  //#region Board Accessors
  getBoard(): Observable<Board | null> {
    return this.board$;
  }

  getCurrentBoard(): Board | null {
    return this.boardSubject.value;
  }
  //#endregion Board Accessors

  //#region List Operations
  createList(request: CreateListRequest): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const now = new Date();
    const newList: List = {
      id: this.generateId(),
      title: request.title,
      tasks: [],
      createdAt: now,
      updatedAt: now,
    };

    board.lists.push(newList);
    this.saveBoard(board);
  }

  updateList(request: UpdateListRequest): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const list = board.lists.find(c => c.id === request.id);
    if (list) {
      list.title = request.title;
      list.updatedAt = new Date();
      this.saveBoard(board);
    }
  }

  deleteList(listId: string): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    board.lists = board.lists.filter(c => c.id !== listId);
    this.saveBoard(board);
  }

  moveList(request: MoveListRequest): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const listIndex = board.lists.findIndex(c => c.id === request.listId);
    if (listIndex === -1) return;

    const [movedList] = board.lists.splice(listIndex, 1);
    board.lists.splice(request.targetIndex, 0, movedList);
    this.saveBoard(board);
  }
  //#endregion List Operations

  //#region Task Operations
  createTask(listId: string, request: CreateTaskRequest): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const list = board.lists.find(c => c.id === listId);
    if (!list) return;

    const now = new Date();
    const newTask: Task = {
      id: this.generateId(),
      title: request.title,
      description: request.description,
      createdAt: now,
      updatedAt: now,
      priority: request.priority,
    };

    list.tasks.push(newTask);
    list.updatedAt = now;
    this.saveBoard(board);
  }

  updateTask(listId: string, request: UpdateTaskRequest): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const list = board.lists.find(c => c.id === listId);
    if (!list) return;

    const task = list.tasks.find(t => t.id === request.id);
    if (!task) return;

    if (request.title !== undefined) task.title = request.title;
    if (request.description !== undefined) task.description = request.description;
    if (request.priority !== undefined) task.priority = request.priority;
    task.updatedAt = new Date();
    list.updatedAt = new Date();
    this.saveBoard(board);
  }

  deleteTask(listId: string, taskId: string): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const list = board.lists.find(c => c.id === listId);
    if (!list) return;

    list.tasks = list.tasks.filter(t => t.id !== taskId);
    list.updatedAt = new Date();
    this.saveBoard(board);
  }

  moveTask(request: MoveTaskRequest): void {
    const board = this.getCurrentBoard();
    if (!board) return;

    const sourceList = board.lists.find(c => c.id === request.sourceListId);
    const targetList = board.lists.find(c => c.id === request.targetListId);

    if (!sourceList || !targetList) return;

    const taskIndex = sourceList.tasks.findIndex(t => t.id === request.taskId);
    if (taskIndex === -1) return;

    const [movedTask] = sourceList.tasks.splice(taskIndex, 1);
    movedTask.updatedAt = new Date();

    targetList.tasks.splice(request.targetIndex, 0, movedTask);

    sourceList.updatedAt = new Date();
    targetList.updatedAt = new Date();
    this.saveBoard(board);
  }
  //#endregion Task Operations
}
