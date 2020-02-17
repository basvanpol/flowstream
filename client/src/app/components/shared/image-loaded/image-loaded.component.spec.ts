import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLoadedComponent } from './image-loaded.component';

describe('ImageLoadedComponent', () => {
  let component: ImageLoadedComponent;
  let fixture: ComponentFixture<ImageLoadedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLoadedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLoadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
