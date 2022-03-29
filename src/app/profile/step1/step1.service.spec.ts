import { TestBed } from '@angular/core/testing';

import { Step1Service } from './step1.service';

describe('Step1Service', () => {
  let service: Step1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Step1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
