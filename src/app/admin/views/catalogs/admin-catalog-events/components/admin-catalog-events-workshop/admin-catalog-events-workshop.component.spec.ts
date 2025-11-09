import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsWorkshopComponent } from './admin-catalog-events-workshop.component';

describe('AdminCatalogEventsWorkshopComponent', () => {
  let component: AdminCatalogEventsWorkshopComponent;
  let fixture: ComponentFixture<AdminCatalogEventsWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
