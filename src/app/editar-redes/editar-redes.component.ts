import { HttpClient, HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { url } from 'node:inspector';

@Component({
  selector: 'app-editar-redes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FileUploadModule, HttpClientModule],
  templateUrl: './editar-redes.component.html',
  styleUrl: './editar-redes.component.css'
})
export class EditarRedesComponent implements OnInit{
  
  selectedValue: string = "0";
  form1: FormGroup;
  readonly FILE_URL = 'http://localhost:8000/storage/'; // ENDPOINT PARA GUARDAR ARCHIVOS
  readonly API_REDES: string = '/api/redes';
  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';
  
  
  private http: HttpClient;
  
  constructor(public fb: FormBuilder, private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);
    
    this.form1 = this.fb.group({
      nombre: ['', Validators.required],
      url: ['', Validators.required],
      foto: [null],
    });
    
  }
  ngOnInit() {
    this.verify_admin();

    this.http.get(this.API_REDES).subscribe(
          (response: any) => {
    
            this.form1.setValue({
              nombre: response.socials[this.selectedValue].nombre,
              url: response.socials[this.selectedValue].url,
              foto: null,
            });
            
          },
          (error) => {
            console.log(error);
          }
        );
    
  }

  

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

  loadData(target: EventTarget | null){
    if (!target) {
      return;
    }
    const selectedElement = target as HTMLSelectElement;
    this.selectedValue = selectedElement.value;
    this.http.get(this.API_REDES).subscribe(
      (response: any) => {

        this.form1.setValue({
          nombre: response.socials[this.selectedValue].nombre,
          url: response.socials[this.selectedValue].url,
          foto: null,
        });
        
      },
      (error) => {
        console.log(error);
      }
    );
  
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

  onSubmit1(event: Event) {
    const formData: any = new FormData();
  
    formData.append('nombre', this.form1.get('nombre')?.value);
    formData.append('url', this.form1.get('url')?.value);

    const foto = this.form1.get('foto')?.value;
      if (foto instanceof File) {
        formData.append('foto', foto);
      }
      
    console.log(formData.get('foto'));
    let id = parseInt(this.selectedValue, 10);
    id +=1;
    
  
    this.http.post(this.API_REDES + "/" + (id), formData).subscribe(
      (response: any) => {
        alert('Red social actualizada');
      },
      (error) => {
        console.log(formData);
        
        console.log(error);
      }
    );
  }
  
  uploadFoto1(event: Event) {
    
    const file = (event.target as HTMLInputElement)?.files?.[0];
    const fileType = file?.type;
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (!validImageTypes.includes(fileType as string)) {
      alert('Por favor sube un archivo de tipo imagen (gif, jpeg, or png).');
      return;
    }else{

    this.form1.patchValue({
      foto: file
    });
    this.form1.get('foto')?.updateValueAndValidity();

    }
  } 
}
