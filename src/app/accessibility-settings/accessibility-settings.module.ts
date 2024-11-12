import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessibilitySettingsPageRoutingModule } from './accessibility-settings-routing.module';

import { AccessibilitySettingsPage } from './accessibility-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessibilitySettingsPageRoutingModule
  ],
  declarations: [AccessibilitySettingsPage]
})
export class AccessibilitySettingsPageModule {}
