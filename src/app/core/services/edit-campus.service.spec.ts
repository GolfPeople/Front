import { TestBed } from '@angular/core/testing';

import { EditCampusService } from './edit-campus.service';

describe('EditCampusService', () => {
  let service: EditCampusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditCampusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
