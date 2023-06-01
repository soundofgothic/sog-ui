import { TestBed, inject } from '@angular/core/testing';

import { VoiceService } from './voice.service';

describe('VoiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoiceService]
    });
  });

  it('should be created', inject([VoiceService], (service: VoiceService) => {
    expect(service).toBeTruthy();
  }));
});
