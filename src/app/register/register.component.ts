import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule

  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private http: HttpClient;

  constructor(private router: Router, handler: HttpBackend) { 
    this.http = new HttpClient(handler);
  }

  readonly API_REGISTER: string = '/api/auth/register';

  
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password_confirmation: new FormControl('', Validators.required), 
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const passwordControl = control.get('password');
    const password = passwordControl ? passwordControl.value : '';

    const confirmPasswordControl = control.get('password_confirmation');
    const confirmPassword = confirmPasswordControl ? confirmPasswordControl.value : '';

    if (password !== confirmPassword) {
      return { NoPassswordMatch: true };

    }
  
    return null;
  }
  

  submitted = false;

  onSubmit(event: Event) {
    event.preventDefault(); 
    this.submitted = true;
    const data = this.registerForm.value;

    this.http.post(this.API_REGISTER, data, { withCredentials: true }).subscribe(
      (response: any) => {
        this.router.navigate(['/iniciar-sesion']);

      },
      (error) => {
        console.log(error);
      }
    )
  }

}
