import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSettings } from './lab-settings';

describe('LabSettings', () => {
  let component: LabSettings;
  let fixture: ComponentFixture<LabSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
