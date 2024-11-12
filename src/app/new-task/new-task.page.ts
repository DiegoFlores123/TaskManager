import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})
export class NewTaskPage implements OnInit {
  task: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'baja',
    state: 'inicial',
    type: 'personales',
    notes: ''
  };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { task: Task };
    if (state && state.task) {
      this.task = { ...state.task };
    }
  }

  saveTask() {
    if (this.task.id) {
      this.taskService.editTask(this.task);
    } else {
      this.taskService.addTask(this.task);
    }
    this.router.navigate(['/home']);
  }
}
