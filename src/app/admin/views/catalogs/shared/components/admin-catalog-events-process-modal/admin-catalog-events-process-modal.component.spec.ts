import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsProcessModalComponent } from './admin-catalog-events-process-modal.component';

describe('AdminCatalogEventsProcessModalComponent', () => {
  let component: AdminCatalogEventsProcessModalComponent;
  let fixture: ComponentFixture<AdminCatalogEventsProcessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsProcessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsProcessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
