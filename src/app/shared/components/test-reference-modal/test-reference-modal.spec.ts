import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReferenceModal } from './test-reference-modal';

describe('TestReferenceModal', () => {
  let component: TestReferenceModal;
  let fixture: ComponentFixture<TestReferenceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestReferenceModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReferenceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
