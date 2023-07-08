import { TestBed, inject } from '@angular/core/testing';

import { URLParamsService } from './urlparams.service';

describe('URLParamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [URLParamsService]
    });
  });

  it('should be created', inject([URLParamsService], (service: URLParamsService) => {
    expect(service).toBeTruthy();
  }));
});
