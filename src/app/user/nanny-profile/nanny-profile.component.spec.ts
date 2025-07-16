import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NannyProfileComponent } from './nanny-profile.component';

describe('NannyProfileComponent', () => {
  let component: NannyProfileComponent;
  let fixture: ComponentFixture<NannyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NannyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NannyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
