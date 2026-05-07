import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerousReports } from './dangerous-reports';

describe('DangerousReports', () => {
  let component: DangerousReports;
  let fixture: ComponentFixture<DangerousReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DangerousReports],
    }).compileComponents();

    fixture = TestBed.createComponent(DangerousReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
