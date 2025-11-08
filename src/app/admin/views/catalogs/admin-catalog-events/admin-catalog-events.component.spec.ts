import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogEventsComponent } from './admin-catalog-events.component';

describe('AdminCatalogEventsComponent', () => {
  let component: AdminCatalogEventsComponent;
  let fixture: ComponentFixture<AdminCatalogEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
