import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginDialogComponent } from './login-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('LoginDialogComponent', () => {

  let fixture: ComponentFixture<LoginDialogComponent>;
  let component: LoginDialogComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [LoginDialogComponent]
    });

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;

  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
