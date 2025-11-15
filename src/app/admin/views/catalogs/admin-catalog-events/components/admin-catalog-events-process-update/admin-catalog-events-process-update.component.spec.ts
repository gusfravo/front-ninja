import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsProcessUpdateComponent } from './admin-catalog-events-process-update.component';

describe('AdminCatalogEventsProcessUpdateComponent', () => {
  let component: AdminCatalogEventsProcessUpdateComponent;
  let fixture: ComponentFixture<AdminCatalogEventsProcessUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsProcessUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsProcessUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
