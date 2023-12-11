import { Component } from '@angular/core';
import { HttpClient, HttpBackend} from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  private http: HttpClient;

  constructor(private router: Router, handler: HttpBackend) { 
    this.http = new HttpClient(handler);
  }

  readonly API_LOGIN: string = '/api/auth/login';

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit(event: Event) {
    event.preventDefault(); 
    const data = this.loginForm.value;    

    this.http.post(this.API_LOGIN, data, { withCredentials: true }).subscribe(
      (response: any) => {
        localStorage.setItem('authToken', response.access_token);

        this.router.navigate(['/admin']);

      },
      (error) => {
        console.log(error);
      }
    );

    
}
}
