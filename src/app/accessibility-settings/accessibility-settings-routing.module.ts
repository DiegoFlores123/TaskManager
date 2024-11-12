import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessibilitySettingsPage } from './accessibility-settings.page';

const routes: Routes = [
  {
    path: '',
    component: AccessibilitySettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessibilitySettingsPageRoutingModule {}
