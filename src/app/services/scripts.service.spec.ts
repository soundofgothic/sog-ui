import { TestBed, inject } from '@angular/core/testing';

import { ScriptsService } from './scripts.service';

describe('ScriptsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScriptsService]
    });
  });

  it('should be created', inject([ScriptsService], (service: ScriptsService) => {
    expect(service).toBeTruthy();
  }));
});
