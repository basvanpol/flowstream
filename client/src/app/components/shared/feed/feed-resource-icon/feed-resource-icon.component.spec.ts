import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedResourceIconComponent } from './feed-resource-icon.component';

describe('FeedResourceIconComponent', () => {
  let component: FeedResourceIconComponent;
  let fixture: ComponentFixture<FeedResourceIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedResourceIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedResourceIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
