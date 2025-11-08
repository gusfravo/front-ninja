import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsUpdateComponent } from './admin-catalog-events-update.component';

describe('AdminCatalogEventsUpdateComponent', () => {
  let component: AdminCatalogEventsUpdateComponent;
  let fixture: ComponentFixture<AdminCatalogEventsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
