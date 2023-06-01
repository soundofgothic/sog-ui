import { TestBed, inject } from '@angular/core/testing';

import { NPCService } from './npc.service';

describe('NpcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NPCService]
    });
  });

  it('should be created', inject([NPCService], (service: NPCService) => {
    expect(service).toBeTruthy();
  }));
});
