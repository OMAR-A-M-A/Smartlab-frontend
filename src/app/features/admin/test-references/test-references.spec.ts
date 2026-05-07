import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReferences } from './test-references';

describe('TestReferences', () => {
  let component: TestReferences;
  let fixture: ComponentFixture<TestReferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestReferences],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
