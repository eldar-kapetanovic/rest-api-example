import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostsComponent } from './posts.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PostsComponent', () => {

  let fixture: ComponentFixture<PostsComponent>;
  let component: PostsComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [PostsComponent]
    });

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
