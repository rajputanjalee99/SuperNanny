import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSchedulesComponent } from './notification-schedules.component';

describe('NotificationSchedulesComponent', () => {
  let component: NotificationSchedulesComponent;
  let fixture: ComponentFixture<NotificationSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationSchedulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
