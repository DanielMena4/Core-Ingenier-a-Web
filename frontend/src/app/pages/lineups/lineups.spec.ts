import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lineups } from './lineups';

describe('Lineups', () => {
  let component: Lineups;
  let fixture: ComponentFixture<Lineups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lineups],
    }).compileComponents();

    fixture = TestBed.createComponent(Lineups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
