import { TestBed } from '@angular/core/testing';

import { ManageStaff } from './manage-staff';

describe('ManageStaff', () => {
  let service: ManageStaff;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageStaff);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
