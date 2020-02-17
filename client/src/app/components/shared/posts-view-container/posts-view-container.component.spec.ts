import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsViewContainerComponent } from './posts-view-container.component';

describe('PostsViewContainerComponent', () => {
  let component: PostsViewContainerComponent;
  let fixture: ComponentFixture<PostsViewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsViewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
