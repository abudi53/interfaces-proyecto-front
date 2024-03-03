import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit{

  ngOnInit(): void {
    this.verify_admin();
  }

  private http: HttpClient;

  constructor(private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';
  readonly API_ME: string = '/api/auth/me';

  verify_admin() {
    const token = localStorage.getItem('authToken');

    this.http.post(this.API_ME, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar si es admin
      (response: any) => {
        if (response.is_admin) {
          console.log('Es admin');
          this.refresh_token();
          
        } else {
          console.log('No es admin');
          this.router.navigate(['/home']);
        }
      });
  }

  refresh_token() {

    const token = localStorage.getItem('authToken');

    this.http.get(this.API_VERIFY, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar token
    (response: any) => { 
      this.http.post(this.API_REFRESH, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Refrescar token
        (response: any) => {
          console.log(response);
          
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

  boton_perfil() {
    const token = localStorage.getItem('authToken');

    this.http.get(this.API_VERIFY, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar token
      (response: any) => { 
        this.http.post(this.API_REFRESH, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Refrescar token
          (response: any) => {
            localStorage.setItem('authToken', response.access_token);
            this.router.navigate(['/perfil']);
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

  crearLibro() {
    this.router.navigate(['/crear-libro']);
  }

  verLibros() {
    this.router.navigate(['/home']);
  }

  editarRedes() {
    this.router.navigate(['/editar-redes']);
  }


}
