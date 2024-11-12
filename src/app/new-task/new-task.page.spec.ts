import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTaskPage } from './new-task.page';

describe('NewTaskPage', () => {
  let component: NewTaskPage;
  let fixture: ComponentFixture<NewTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
