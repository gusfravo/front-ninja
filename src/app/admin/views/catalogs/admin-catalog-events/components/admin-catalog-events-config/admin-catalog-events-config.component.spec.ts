import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsConfigComponent } from './admin-catalog-events-config.component';

describe('AdminCatalogEventsConfigComponent', () => {
  let component: AdminCatalogEventsConfigComponent;
  let fixture: ComponentFixture<AdminCatalogEventsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
