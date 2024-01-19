import { Component } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ver-libros',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './ver-libros.component.html',
  styleUrl: './ver-libros.component.css'
})
export class VerLibrosComponent {
  private http: HttpClient;
  private BASE_URL = 'http://localhost:8001/api';


  constructor(private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);

  }

  readonly API_VER_LIBROS: string = '/api/products';
  data_libros: any = [];

  ngOnInit(): void {
    this.loadLibros();
  }

  loadLibros() {
    this.http.get(this.API_VER_LIBROS).subscribe(
      (response: any) => {
        this.data_libros = response.data || {};
      }
    );
  }

}
