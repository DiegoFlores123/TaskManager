// src/app/pages/calendar/calendar.page.ts
import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Router } from '@angular/router';

interface CalendarDay {
  date: Date;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  currentMonth: Date = new Date();
  days: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadMonthTasks();
  }

  loadMonthTasks() {
    const tasks = this.taskService.getTasks();
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    this.days = [];

    for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
      const dayTasks = tasks.filter(task => {
        const taskDueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
        return taskDueDate.toDateString() === day.toDateString();
      });
      this.days.push({ date: new Date(day), tasks: dayTasks });
    }
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.loadMonthTasks();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.loadMonthTasks();
  }

  viewTasks(day: CalendarDay) {
    this.selectedDay = day;
  }

  closeTaskView() {
    this.selectedDay = null;
  }

  goBackToList() {
    this.router.navigate(['/home']);
  }
}
