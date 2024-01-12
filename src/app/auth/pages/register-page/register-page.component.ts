import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../services/validators.service';
import { RegisterRequest } from '../../interfaces';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  private fb = inject( FormBuilder );
  private authService = inject( AuthService );
  private validatorsService = inject( ValidatorsService );
  private router = inject( Router );

  public myForm: FormGroup = this.fb.group({
    name: ['', [ Validators.required ] ],
    email: ['', [ Validators.required, Validators.email ] ],
    password: ['', [ Validators.required, Validators.minLength(6) ] ],
    password2: ['', [ Validators.required, Validators.minLength(6) ] ],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'password2')
    ]
  });

  register() {
    const { name, email, password }: RegisterRequest = this.myForm.value;
    this.authService.register( { name, email, password } )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: error => {
          Swal.fire('Error', error, 'error')
        }
      });
  }

}
