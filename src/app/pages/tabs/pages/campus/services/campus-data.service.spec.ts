import { TestBed } from '@angular/core/testing';

import { CampusDataService } from './campus-data.service';

describe('CampusDataService', () => {
  let service: CampusDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
