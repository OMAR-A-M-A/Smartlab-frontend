import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStaff } from './manage-staff';

describe('ManageStaff', () => {
  let component: ManageStaff;
  let fixture: ComponentFixture<ManageStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStaff],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageStaff);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
