import { TestBed } from '@angular/core/testing';

import { Step2Service } from './step2.service';

describe('Step2Service', () => {
  let service: Step2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Step2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
