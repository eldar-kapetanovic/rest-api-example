import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostDetailsComponent } from './post-details.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PostDetailsComponent', () => {

  let fixture: ComponentFixture<PostDetailsComponent>;
  let component: PostDetailsComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PostDetailsComponent]
    });

    fixture = TestBed.createComponent(PostDetailsComponent);
    component = fixture.componentInstance;

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
