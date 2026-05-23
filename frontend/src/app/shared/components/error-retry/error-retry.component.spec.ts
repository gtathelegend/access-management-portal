import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorRetryComponent } from './error-retry.component';

describe('ErrorRetryComponent', () => {
  let component: ErrorRetryComponent;
  let fixture: ComponentFixture<ErrorRetryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorRetryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorRetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
