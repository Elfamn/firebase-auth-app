export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  timeEstimate: {
    hours: number;
    minutes: number;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  order?: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  timeEstimate: {
    hours: number;
    minutes: number;
  };
}