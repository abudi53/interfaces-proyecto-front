import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [FormsModule, NgFor,CommonModule, ReactiveFormsModule ],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.css'
})
export class videoComponent implements OnInit {

  nombreform = new FormControl('');
  linkform = new FormControl('');





  ngOnInit(): void {
    this.refresh_token();
}

private http: HttpClient;

constructor(private router: Router, handler: HttpBackend) {
  this.http = new HttpClient(handler);
}

readonly API_VERIFY: string = '/api/auth/verify-token';
readonly API_REFRESH: string = '/api/auth/refresh';
  

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
  onSubmit(form: NgForm) {}



}
    

