import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffModal } from './staff-modal';

describe('StaffModal', () => {
  let component: StaffModal;
  let fixture: ComponentFixture<StaffModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffModal],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
