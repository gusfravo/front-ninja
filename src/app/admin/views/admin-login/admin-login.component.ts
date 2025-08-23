import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminLoginFormComponent } from './components/admin-login-form/admin-login-form.component';

@Component({
  selector: 'app-admin-login',
  imports: [
    RouterLink,
    AdminLoginFormComponent
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {

}
