import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchInterviewComponent } from './watch-interview.component';

describe('WatchInterviewComponent', () => {
  let component: WatchInterviewComponent;
  let fixture: ComponentFixture<WatchInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchInterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
