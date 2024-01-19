import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-libro',
  standalone: true,
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-libro.component.html',
  styleUrl: './crear-libro.component.css'
})
export class CrearLibroComponent implements OnInit{

  private http: HttpClient;
  private BASE_URL = 'http://localhost:8001/api';


  constructor(private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  libroForm = new FormGroup({
    nombre: new FormControl(''),
    autor: new FormControl(''),
    editorial: new FormControl(''),
    fecha: new FormControl(''),
    imagen: new FormControl(''),
    pdf: new FormControl(''),
    Categoria: new FormControl(''),  });

  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';
  readonly API_CREAR_LIBRO: string = '/api/product';

  ngOnInit(): void {
      this.refresh_token();
      
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

  onSubmit(event: Event) {
    event.preventDefault(); 

    const formData = new FormData();
    const data = this.libroForm.value;    


    this.http.post(`${this.BASE_URL}/product`, data).subscribe(
      (response: any) => {
        this.refresh_token();

        this.router.navigate(['/ver-libros']);

      },
      (error) => {
        console.log(data);
        
        console.log(error);
      }
    );
  }
}

