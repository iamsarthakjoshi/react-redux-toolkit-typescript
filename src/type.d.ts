export interface Task {
  id: string;
  description: string;
  isComplete: boolean;
}

export interface State {
  tasks: Task[];
  selectedTask: string | null;
  counter: number;
}
