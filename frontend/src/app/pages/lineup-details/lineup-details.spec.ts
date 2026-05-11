import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupDetails } from './lineup-details';

describe('LineupDetails', () => {
  let component: LineupDetails;
  let fixture: ComponentFixture<LineupDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineupDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(LineupDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
