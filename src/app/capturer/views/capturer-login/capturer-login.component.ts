import { Component } from '@angular/core';
import { CapturerLoginFormComponent } from './components/capturer-login-form/capturer-login-form.component';
import { OnClickCapturerLoginDirective } from './directives/on-click-capturer-login.directive';

@Component({
  selector: 'app-capturer-login',
  imports: [
    CapturerLoginFormComponent,
    OnClickCapturerLoginDirective
  ],
  templateUrl: './capturer-login.component.html',
  styleUrl: './capturer-login.component.scss',
  standalone: true
})
export class CapturerLoginComponent { }
