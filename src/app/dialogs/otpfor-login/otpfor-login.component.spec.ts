import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPforLoginComponent } from './otpfor-login.component';

describe('OTPforLoginComponent', () => {
  let component: OTPforLoginComponent;
  let fixture: ComponentFixture<OTPforLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTPforLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OTPforLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
