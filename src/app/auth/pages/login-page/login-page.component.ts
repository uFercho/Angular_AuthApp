import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router );

  public myForm: FormGroup = this.fb.group({
    email: ['fernando@google.com', [ Validators.required, Validators.email ] ],
    password: ['123456', [ Validators.required, Validators.minLength(6) ] ],
  });

  login() {
    const { email, password } = this.myForm.value;
    this.authService.login( email, password )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: error => {
          Swal.fire('Error', error, 'error')
        }
      })
  }

}
