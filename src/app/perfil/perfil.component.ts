import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { log } from 'console';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{

  email: string = '';
  data_user: any;
  data_profile: any = {
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    cedula: '',
    estado: ''
  };

  private http: HttpClient;

  constructor(private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  readonly API_ME: string = '/api/auth/me';
  readonly API_PROFILE: string = '/api/profile';
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
        this.data_user = response;
        this.email = this.data_user.email; 
               
        this.http.get(this.API_PROFILE + '/' + this.data_user.profile_id, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
          (response: any) => {
            this.data_profile = response || {};
            console.log(this.API_PROFILE + '/' + this.data_profile.id);
            console.log(this.data_profile.id);
            
            
            console.log(this.data_profile);
            
          },
          (error) => {
            console.error(error);
            this.data_profile = {};
          }
        );
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

  onSubmit(form: NgForm) {

    if (form.valid) {
      
    
    
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
  
    if (this.data_profile && this.data_profile.id) {
      // If the profile exists, send a PUT request
      this.http.put(this.API_PROFILE + '/' + this.data_user.profile_id, this.data_profile, { headers }).subscribe(
        (response: any) => {
          this.data_profile = response;
          alert('Perfil actualizado');
        },
        (error) => {
          alert('Error al actualizar perfil');
        }
      );
    } else {
      this.data_profile.user_id = this.data_user.id;
      console.log(this.data_profile);
      
      // If the profile doesn't exist, send a POST request
      this.http.post(this.API_PROFILE, this.data_profile, { headers }).subscribe(
        (response: any) => {
          alert('Perfil creado');
        },
        (error) => {
          alert('Error al crear perfil');
        }
      );
    }
  } else {
    let invalidFields = [];
    for (let control in form.controls) {
      if (form.controls[control].invalid) {
        invalidFields.push(control);
      }
    }
    alert('The following fields are invalid: ' + invalidFields.join(', '));

  }
  }


}
