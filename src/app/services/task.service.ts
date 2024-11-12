// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;  // Asegúrate de que `dueDate` sea un Date
  priority: 'baja' | 'media' | 'alta';
  state: 'inicial' | 'en ejecución' | 'terminada';
  type: 'personales' | 'trabajo' | 'sociales';
  notes?: string;
  reminder?: Date;  // Nueva propiedad para recordatorio
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    const tasks = localStorage.getItem('tasks');
    this.tasks = tasks ? JSON.parse(tasks).map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      reminder: task.reminder ? new Date(task.reminder) : undefined,
    })) : [];
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Añadido el método setTasks
  setTasks(newTasks: Task[]): void {
    this.tasks = newTasks.map(task => ({
      ...task,
      dueDate: new Date(task.dueDate),
      reminder: task.reminder ? new Date(task.reminder) : undefined
    }));
    this.saveTasks();
  }

  getTasks(filterType?: string, filterPriority?: string, filterState?: string): Task[] {
    return this.tasks.filter(task => {
      return (!filterType || task.type === filterType) &&
             (!filterPriority || task.priority === filterPriority) &&
             (!filterState || task.state === filterState);
    });
  }

  addTask(task: Task): void {
    task.id = new Date().getTime();
    this.tasks.push(task);
    this.saveTasks();
    if (task.reminder) {
      this.scheduleNotification(task); // Programar notificación si hay un recordatorio
    }
  }

  editTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
      if (updatedTask.reminder) {
        this.scheduleNotification(updatedTask); // Programar notificación si hay un recordatorio
      }
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
  }

  // Nueva función para actualizar el orden de las tareas
  updateTaskOrder(updatedTasks: Task[]): void {
    this.tasks = updatedTasks;  // Actualizamos el array de tareas con el nuevo orden
    this.saveTasks();  // Guardamos el nuevo orden en el almacenamiento local
  }

  markAsCompleted(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.state = 'terminada';
      this.saveTasks();
    }
  }

  reprogramarTarea(taskId: number, newDate: Date): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.dueDate = newDate; // Actualizamos la fecha de la tarea
      this.saveTasks();
    }
  }

  // Nueva función para programar notificaciones locales
  async scheduleNotification(task: Task): Promise<void> {
    const reminderDate = task.reminder || task.dueDate; // Usamos la fecha de recordatorio o la fecha de vencimiento

    if (reminderDate && reminderDate > new Date()) {
      const notificationTime = new Date(reminderDate).getTime();
      
      // Programar la notificación
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `Recordatorio: ${task.title}`,
            body: task.description,
            id: task.id,
            schedule: { at: new Date(notificationTime) },
            sound: 'default',
            attachments: [],
            actionTypeId: '',
            extra: {
              taskId: task.id
            },
          },
        ],
      });
    }
  }
}
