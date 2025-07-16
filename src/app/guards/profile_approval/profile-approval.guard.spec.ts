import { TestBed } from '@angular/core/testing';

import { ProfileApprovalGuard } from './profile-approval.guard';

describe('ProfileApprovalGuard', () => {
  let guard: ProfileApprovalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProfileApprovalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
