import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpStepComponent } from './user-up-step.component';

describe('UserUpStepComponent', () => {
  let component: UserUpStepComponent;
  let fixture: ComponentFixture<UserUpStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUpStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
