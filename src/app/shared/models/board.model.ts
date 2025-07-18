export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export interface List {
  id: string;
  title: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export interface CreateListRequest {
  title: string;
}

export interface UpdateListRequest {
  id: string;
  title: string;
}

export interface MoveTaskRequest {
  taskId: string;
  sourceListId: string;
  targetListId: string;
  targetIndex: number;
}

export interface MoveListRequest {
  listId: string;
  targetIndex: number;
}
