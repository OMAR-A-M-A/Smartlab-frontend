import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientModal } from './patient-modal';

describe('PatientModal', () => {
  let component: PatientModal;
  let fixture: ComponentFixture<PatientModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
