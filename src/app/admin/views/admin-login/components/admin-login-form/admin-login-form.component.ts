import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms'

@Component({
  selector: 'app-admin-login-form',
  imports: [
    FormsModule
  ],
  templateUrl: './admin-login-form.component.html',
  styleUrl: './admin-login-form.component.scss'
})
export class AdminLoginFormComponent {

  public loginFormGroup: FormGroup

}
