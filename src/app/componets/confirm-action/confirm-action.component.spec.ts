import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmActionComponent } from './confirm-action.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ConfirmActionComponent', () => {

  let fixture: ComponentFixture<ConfirmActionComponent>;
  let component: ConfirmActionComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ConfirmActionComponent]
    });

    fixture = TestBed.createComponent(ConfirmActionComponent);
    component = fixture.componentInstance;

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
