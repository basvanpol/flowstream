import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedResourceDateComponent } from './feed-resource-date.component';

describe('FeedResourceDateComponent', () => {
  let component: FeedResourceDateComponent;
  let fixture: ComponentFixture<FeedResourceDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedResourceDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedResourceDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
