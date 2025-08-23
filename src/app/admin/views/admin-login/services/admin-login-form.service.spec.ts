import { TestBed } from '@angular/core/testing';

import { AdminLoginFormService } from './admin-login-form.service';

describe('AdminLoginFormService', () => {
  let service: AdminLoginFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLoginFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
