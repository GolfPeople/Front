import { TestBed } from '@angular/core/testing';

import { Step6Service } from './step6.service';

describe('Step6Service', () => {
  let service: Step6Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Step6Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
