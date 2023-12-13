import { Component, inject } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule

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
    email: new FormControl(''),
    password: new FormControl(''),
    password_confirmation: new FormControl(''),
  });

  onSubmit(event: Event) {
    event.preventDefault(); 
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
