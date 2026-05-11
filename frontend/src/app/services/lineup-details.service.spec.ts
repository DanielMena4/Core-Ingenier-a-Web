import { TestBed } from '@angular/core/testing';

import { LineupDetailsService } from './lineup-details.service';

describe('LineupDetails', () => {
  let service: LineupDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineupDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
