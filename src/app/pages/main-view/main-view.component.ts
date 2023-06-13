import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITask, ISubtask } from 'src/app/models/task';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  todoForm!: FormGroup;
  tasks: ITask[] = [];
  inprogress: ITask[] = []; // Dodajemy właściwość inprogress jako pustą tablicę
  done: ITask[] = [];
  updateIndex: any;
  isEditEnabled: boolean = false;
  newSubtask: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required]
    });
  }

  addTask() {
    const newTask: ITask = {
      description: this.todoForm.value.item,
      subtasks: [],
      done: false
    };
    this.tasks.push(newTask);
    this.todoForm.reset();
  }
  

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
  }

  addSubtask(taskIndex: number, subtaskDescription: string) {
    const task = this.tasks[taskIndex];
    if (task.subtasks === undefined) {
      task.subtasks = [];
    }
    const subtask: ISubtask = {
      description: subtaskDescription,
      done: false
    };
    task.subtasks.push(subtask);
  }
  
  
  deleteSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.tasks[taskIndex];
    if (task.subtasks !== undefined) {
      task.subtasks.splice(subtaskIndex, 1);
    }
  }
  
  

  deleteInPrograssTask(i: number) {
    this.inprogress.splice(i, 1);
  }

  deleteDoneTask(i: number) {
    this.done.splice(i, 1);
  }

  onEdit(i: number, item: ITask) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  updateTask() {
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
