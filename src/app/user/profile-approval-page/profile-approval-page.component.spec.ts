import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileApprovalPageComponent } from './profile-approval-page.component';

describe('ProfileApprovalPageComponent', () => {
  let component: ProfileApprovalPageComponent;
  let fixture: ComponentFixture<ProfileApprovalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileApprovalPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileApprovalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
