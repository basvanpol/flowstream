import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedResourceNameComponent } from './feed-resource-name.component';

describe('FeedResourceNameComponent', () => {
  let component: FeedResourceNameComponent;
  let fixture: ComponentFixture<FeedResourceNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedResourceNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedResourceNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
