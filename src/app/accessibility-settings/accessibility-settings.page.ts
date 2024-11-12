import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-accessibility-settings',
  templateUrl: './accessibility-settings.page.html',
  styleUrls: ['./accessibility-settings.page.scss'],
})
export class AccessibilitySettingsPage {
  largeText: boolean;
  highContrast: boolean;

  constructor(private modalController: ModalController) {
    // Cargar las preferencias de accesibilidad desde localStorage o establecer por defecto a false
    this.largeText = JSON.parse(localStorage.getItem('largeText') || 'false');
    this.highContrast = JSON.parse(localStorage.getItem('highContrast') || 'false');

    // Aplica las clases de accesibilidad si están activadas
    if (this.largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }

    if (this.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  toggleLargeText() {
    // Guardar el estado de texto grande en localStorage
    localStorage.setItem('largeText', JSON.stringify(this.largeText));

    // Aplicar o quitar la clase 'large-text' del body
    document.body.classList.toggle('large-text', this.largeText);
  }

  toggleHighContrast() {
    // Guardar el estado de alto contraste en localStorage
    localStorage.setItem('highContrast', JSON.stringify(this.highContrast));

    // Aplicar o quitar la clase 'high-contrast' del body
    document.body.classList.toggle('high-contrast', this.highContrast);
  }
}
