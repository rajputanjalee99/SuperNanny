import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchFullScreenComponent } from './watch-full-screen.component';

describe('WatchFullScreenComponent', () => {
  let component: WatchFullScreenComponent;
  let fixture: ComponentFixture<WatchFullScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchFullScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchFullScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
