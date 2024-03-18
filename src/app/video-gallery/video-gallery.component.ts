import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [FormsModule, NgFor,CommonModule, ReactiveFormsModule ],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.css'
})
export class videoComponent implements OnInit {

  ngOnInit(): void {
    this.refresh_token();
}

form: FormGroup;
private http: HttpClient;

constructor(private router: Router, handler: HttpBackend, public fb: FormBuilder) {
  this.http = new HttpClient(handler);
  this.form = this.fb.group({
    nombre: ['', Validators.required],
    link: ['', Validators.required],
  });
}

readonly API_VERIFY: string = '/api/auth/verify-token';
readonly API_REFRESH: string = '/api/auth/refresh';
readonly API_VIDEOS: string = '/api/videos';
  

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
  onSubmit(event: Event) {
    const formData: any = new FormData();
  
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('link', this.form.get('link')?.value);
      
    this.http.post(this.API_VIDEOS, formData).subscribe(
      (response: any) => {
        alert('Video agregado');
      },
      (error) => {        
        console.log(error);
      }
    );
  }



}
    

