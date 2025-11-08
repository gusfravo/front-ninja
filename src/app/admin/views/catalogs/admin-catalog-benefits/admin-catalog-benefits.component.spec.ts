import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogBenefitsComponent } from './admin-catalog-benefits.component';

describe('AdminCatalogBenefitsComponent', () => {
  let component: AdminCatalogBenefitsComponent;
  let fixture: ComponentFixture<AdminCatalogBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogBenefitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
