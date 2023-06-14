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
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
    const savedInprogress = localStorage.getItem('inprogress');
    if (savedInprogress) {
      this.inprogress = JSON.parse(savedInprogress);
    }
    const savedDone = localStorage.getItem('done');
    if (savedDone) {
      this.done = JSON.parse(savedDone);
    }

  }

  addTask() {
    const newTask: ITask = {
      description: this.todoForm.value.item,
      subtasks: [],
      done: false
    };
    this.tasks.push(newTask);
    this.todoForm.reset();
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
  

editSubtask(task: ITask, subtask: ISubtask) {
  // Przypisanie wartości do pola edycji podzadania
  this.newSubtask = subtask.description;

  // Usunięcie istniejącego podzadania
  const subtaskIndex = task.subtasks.indexOf(subtask);
  if (subtaskIndex !== -1) {
    task.subtasks.splice(subtaskIndex, 1);
  }
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
}




  deleteTask(i: number) {
    this.tasks.splice(i, 1);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addSubtask(task: ITask) {
    if (this.newSubtask.trim() !== '') {
      const subtask: ISubtask = {
        description: this.newSubtask.trim(),
        done: false
      };
      task.subtasks.push(subtask);
      this.newSubtask = '';
    }
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
  
  deleteSubtask(task: ITask, subtask: ISubtask) {
    const subtaskIndex = task.subtasks.indexOf(subtask);
    if (subtaskIndex !== -1) {
      task.subtasks.splice(subtaskIndex, 1);
    }
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  deleteInPrograssTask(i: number) {
    this.inprogress.splice(i, 1);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  deleteDoneTask(i: number) {
    this.done.splice(i, 1);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
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
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
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
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('inprogress', JSON.stringify(this.inprogress));
    localStorage.setItem('done', JSON.stringify(this.done));
  }
}
