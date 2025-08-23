import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExcelComponent } from './admin-excel.component';

describe('AdminExcelComponent', () => {
  let component: AdminExcelComponent;
  let fixture: ComponentFixture<AdminExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
