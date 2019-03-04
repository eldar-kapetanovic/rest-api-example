import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostComponent } from './post.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PostComponent', () => {

  let fixture: ComponentFixture<PostComponent>;
  let component: PostComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PostComponent]
    });

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
