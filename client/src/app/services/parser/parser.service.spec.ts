import { TestBed } from '@angular/core/testing';

import { ParserService } from './parser.service';

describe('ParserServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParserService = TestBed.get(ParserService);
    expect(service).toBeTruthy();
  });
});
