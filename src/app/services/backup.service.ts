// backup.service.ts
import { Injectable } from '@angular/core';
import { TaskService, Task } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private backupKey = 'taskBackup';

  constructor(private taskService: TaskService) {}

  // Función para crear una copia de seguridad en LocalStorage
  backupTasks(): boolean {
    const tasks = this.taskService.getTasks();
    localStorage.setItem(this.backupKey, JSON.stringify(tasks));
    return true;
  }

  // Función para restaurar la copia de seguridad desde LocalStorage
  restoreTasks(): boolean {
    const backup = localStorage.getItem(this.backupKey);
    if (backup) {
      const tasks: Task[] = JSON.parse(backup).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        reminder: task.reminder ? new Date(task.reminder) : undefined
      }));
      this.taskService.setTasks(tasks);
      return true;
    } else {
      return false;
    }
  }
  
  
}
