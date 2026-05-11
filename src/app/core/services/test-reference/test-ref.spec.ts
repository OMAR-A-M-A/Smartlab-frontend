import { TestBed } from '@angular/core/testing';

import { TestRef } from './test-ref';

describe('TestRef', () => {
  let service: TestRef;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
