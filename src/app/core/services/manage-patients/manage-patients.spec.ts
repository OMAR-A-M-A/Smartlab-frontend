import { TestBed } from '@angular/core/testing';

import { ManagePatients } from './manage-patients';

describe('ManagePatients', () => {
  let service: ManagePatients;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePatients);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
