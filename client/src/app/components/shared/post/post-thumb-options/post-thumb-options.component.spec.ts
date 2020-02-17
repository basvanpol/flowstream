import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostThumbOptionsComponent } from './post-thumb-options.component';

describe('PostThumbOptionsComponent', () => {
  let component: PostThumbOptionsComponent;
  let fixture: ComponentFixture<PostThumbOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostThumbOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostThumbOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
