// src/app/pages/home/home.page.ts
import { Component } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BackupService } from '../services/backup.service';
import { ModalController } from '@ionic/angular';
import { AccessibilitySettingsPage } from '../accessibility-settings/accessibility-settings.page';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  tasks: Task[] = [];
  filterType: string = '';
  filterPriority: string = '';
  filterState: string = '';
  searchTerm: string = '';  // Nueva propiedad para almacenar el término de búsqueda

  constructor(private taskService: TaskService, private router: Router, private alertController: AlertController, private backupService: BackupService, private modalController: ModalController) {}

  // Método para manejar el evento de arrastre y soltado
  onTaskDrop(event: CdkDragDrop<Task>)  {
    const previousIndex = this.tasks.findIndex(task => task === event.item.data);
    const currentIndex = event.currentIndex;
  
    // Reorganizar las tareas según el arrastre
    this.tasks.splice(previousIndex, 1);
    this.tasks.splice(currentIndex, 0, event.item.data);
  
    // Actualizar el servicio para reflejar el cambio de orden
    this.taskService.updateTaskOrder(this.tasks);
  }

  async openAccessibilitySettings() {
    const modal = await this.modalController.create({
      component: AccessibilitySettingsPage
    });
    await modal.present();
  }

  // Método para hacer la copia de seguridad y mostrar alerta
  async backupTasks() {
    const success = this.backupService.backupTasks();
    if (success) {
      const alert = await this.alertController.create({
        header: 'Copia de Seguridad',
        message: 'El respaldo de tareas se realizó correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Método para restaurar el respaldo y mostrar alerta
  async restoreTasks() {
    const success = this.backupService.restoreTasks();
    const alert = await this.alertController.create({
      header: 'Restaurar Tareas',
      message: success 
        ? 'Las tareas fueron restauradas correctamente.'
        : 'No se encontró ningún respaldo para restaurar.',
      buttons: ['OK']
    });
    await alert.present();
    
    if (success) {
      this.loadTasks(); // Recargar las tareas después de la restauración
    }
  }


  // Método para editar la tarea
  editTask(task: Task) {
    this.router.navigate(['/new-task'], { state: { task } });
  }

  // Método que se ejecuta cuando la vista se carga
  ionViewWillEnter() {
    this.loadTasks();
  }

  // Método que carga las tareas aplicando los filtros
  loadTasks() {
    let tasks = this.taskService.getTasks(this.filterType, this.filterPriority, this.filterState);

    // Filtro por nombre de tarea si se ha introducido un término de búsqueda
    if (this.searchTerm) {
      tasks = tasks.filter(task => task.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    // Asignar las tareas filtradas al array 'tasks'
    this.tasks = tasks;
  }

  goToCalendar() {
    this.router.navigate(['/calendar']);
  }

  // Método para eliminar una tarea
  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
    this.loadTasks();
  }

  // Método para marcar una tarea como completada
  markAsCompleted(taskId: number) {
    this.taskService.markAsCompleted(taskId);
    this.loadTasks();
  }

  // Método para reprogramar una tarea
  async reprogramarTarea(task: Task) {
    const alert = await this.alertController.create({
      header: 'Reprogramar tarea',
      message: 'Seleccione una nueva fecha y hora fin, junto con una fecha y hora de un recordatorio para esta tarea.',
      inputs: [
        {
          name: 'newDateTime',
          type: 'datetime-local', // Usamos 'datetime-local' para permitir seleccionar fecha y hora
          value: task.dueDate instanceof Date ? task.dueDate.toISOString().slice(0, 16) : '', // Aseguramos que la fecha tenga formato correcto (sin segundos y milisegundos)
        },
        {
          name: 'reminderTime',
          type: 'datetime-local', // Campo para el recordatorio
          placeholder: 'Seleccione una fecha y hora para el recordatorio', 
          value: task.reminder instanceof Date ? task.reminder.toISOString().slice(0, 16) : '', // Si ya tiene un recordatorio, lo cargamos
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Reprogramar',
          handler: (data) => {
            const newDate = new Date(data.newDateTime); // Convertimos la cadena seleccionada en un objeto Date
            const reminderDate = data.reminderTime ? new Date(data.reminderTime) : undefined; // Si existe, convertimos también el recordatorio

            this.taskService.reprogramarTarea(task.id, newDate); // Llamamos al servicio para reprogramar la tarea

            // Actualizamos el recordatorio si se ha seleccionado una nueva fecha
            if (reminderDate) {
              task.reminder = reminderDate;
            }
            
            this.loadTasks(); // Recargamos las tareas
          }
        }
      ]
    });
    await alert.present(); 
  }
}
