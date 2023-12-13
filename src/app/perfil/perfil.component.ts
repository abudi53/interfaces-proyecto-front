import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  email: string = '';
  data: any;

  private http: HttpClient;

  constructor(private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';

  ngOnInit(): void {
      this.loadData();
      this.refresh_token();
      
  }

  loadData() {

    const token = localStorage.getItem('authToken');

    this.http.post(this.API_ME, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      (response: any) => {
        this.data = response;
        this.email = this.data.email;        
      },
      (error) => {
        console.error(error);
      }
    );


  }

  refresh_token() {

    const token = localStorage.getItem('authToken');

    this.http.get(this.API_VERIFY, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar token
    (response: any) => { 
      this.http.post(this.API_REFRESH, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Refrescar token
        (response: any) => {
          localStorage.setItem('authToken', response.access_token);
        },
        (error) => {
          this.logout();
        }
      );
    },
    (error) => {
      this.logout();
    }
  );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/iniciar-sesion']);
  }


}
