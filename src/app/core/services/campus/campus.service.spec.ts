import { TestBed } from '@angular/core/testing';

import { CampusService } from './campus.service';

describe('CampusService', () => {
  let service: CampusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
