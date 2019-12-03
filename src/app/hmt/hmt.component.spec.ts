import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmtComponent } from './hmt.component';

describe('HmtComponent', () => {
  let component: HmtComponent;
  let fixture: ComponentFixture<HmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
