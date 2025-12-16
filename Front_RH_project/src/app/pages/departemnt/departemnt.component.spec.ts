import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptComponent } from './departemnt.component';

describe('DepartemntComponent', () => {
  let component: DeptComponent;
  let fixture: ComponentFixture<DeptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
