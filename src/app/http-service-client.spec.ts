import { TestBed } from '@angular/core/testing';

import { HttpServiceClient } from './http-service-client';

describe('HttpServiceClient', () => {
  let service: HttpServiceClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpServiceClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
