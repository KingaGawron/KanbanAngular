export interface ITask {
    description: string;
    subtasks: ISubtask[];
    done: boolean;
  }
  
  export interface ISubtask {
    description: string;
    done: boolean;
  }
  
  