import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsProcessComponent } from './admin-catalog-events-process.component';

describe('AdminCatalogEventsProcessComponent', () => {
  let component: AdminCatalogEventsProcessComponent;
  let fixture: ComponentFixture<AdminCatalogEventsProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
