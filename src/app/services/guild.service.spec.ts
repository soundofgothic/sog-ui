import { TestBed, inject } from '@angular/core/testing';

import { GuildService } from './guild.service';

describe('GuildService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuildService]
    });
  });

  it('should be created', inject([GuildService], (service: GuildService) => {
    expect(service).toBeTruthy();
  }));
});
