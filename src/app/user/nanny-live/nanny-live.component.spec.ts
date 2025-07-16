import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NannyLiveComponent } from './nanny-live.component';

describe('NannyLiveComponent', () => {
  let component: NannyLiveComponent;
  let fixture: ComponentFixture<NannyLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NannyLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NannyLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
