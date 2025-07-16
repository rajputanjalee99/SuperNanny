import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNannyProfileComponent } from './edit-nanny-profile.component';

describe('EditNannyProfileComponent', () => {
  let component: EditNannyProfileComponent;
  let fixture: ComponentFixture<EditNannyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNannyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNannyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
