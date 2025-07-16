import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NannyLiveInterviewComponentComponent } from './nanny-live-interview-component.component';

describe('NannyLiveInterviewComponentComponent', () => {
  let component: NannyLiveInterviewComponentComponent;
  let fixture: ComponentFixture<NannyLiveInterviewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NannyLiveInterviewComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NannyLiveInterviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
