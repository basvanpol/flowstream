import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedResourceThumbComponent } from './feed-resource-thumb.component';

describe('FeedResourceThumbComponent', () => {
  let component: FeedResourceThumbComponent;
  let fixture: ComponentFixture<FeedResourceThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedResourceThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedResourceThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
