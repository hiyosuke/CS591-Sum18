import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UberLoginComponent } from './uber-login.component';

describe('UberLoginComponent', () => {
  let component: UberLoginComponent;
  let fixture: ComponentFixture<UberLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UberLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UberLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
