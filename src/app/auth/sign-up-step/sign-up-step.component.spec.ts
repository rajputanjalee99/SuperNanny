import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStepComponent } from './sign-up-step.component';

describe('SignUpStepComponent', () => {
  let component: SignUpStepComponent;
  let fixture: ComponentFixture<SignUpStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
