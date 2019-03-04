import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditPostComponent } from './edit-post.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('EditPostComponent', () => {

  let fixture: ComponentFixture<EditPostComponent>;
  let component: EditPostComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [EditPostComponent]
    });

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
