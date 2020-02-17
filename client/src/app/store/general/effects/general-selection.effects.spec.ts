import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GeneralSelectionEffects } from './general-selection.effects';

describe('GeneralSelectionEffects', () => {
  let actions$: Observable<any>;
  let effects: GeneralSelectionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeneralSelectionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(GeneralSelectionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
