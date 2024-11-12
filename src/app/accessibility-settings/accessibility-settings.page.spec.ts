import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessibilitySettingsPage } from './accessibility-settings.page';

describe('AccessibilitySettingsPage', () => {
  let component: AccessibilitySettingsPage;
  let fixture: ComponentFixture<AccessibilitySettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilitySettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
