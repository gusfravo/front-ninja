import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogBenefitsUpdateComponent } from './admin-catalog-benefits-update.component';

describe('AdminCatalogBenefitsUpdateComponent', () => {
  let component: AdminCatalogBenefitsUpdateComponent;
  let fixture: ComponentFixture<AdminCatalogBenefitsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogBenefitsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogBenefitsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
