import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConfirmationModalComponent } from './select-confirmation-modal.component';

describe('SelectConfirmationModalComponent', () => {
  let component: SelectConfirmationModalComponent;
  let fixture: ComponentFixture<SelectConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
