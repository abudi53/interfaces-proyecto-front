import { HttpClient, HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-redes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FileUploadModule, HttpClientModule],
  templateUrl: './editar-redes.component.html',
  styleUrl: './editar-redes.component.css'
})
export class EditarRedesComponent implements OnInit{

  form: FormGroup;
  private http: HttpClient;

  constructor(public fb: FormBuilder, private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      url: ['', Validators.required],
      foto: [null, this.imageValidator],
    });
  }
  ngOnInit() {
    this.loadData();
    this.verify_admin();
  }
  readonly API_REDES: string = '/api/redes';
  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';

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

  loadData(){
    this.http.get(this.API_REDES).subscribe(
      (response: any) => {
        console.log(response);
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

  onSubmit(event: Event) {
    const formData: any = new FormData();
  
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('url', this.form.get('url')?.value);
    formData.append('foto', this.form.get('foto')?.value);
  
    this.http.post(this.API_REDES, formData).subscribe(
      (response: any) => {
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(formData);
        
        console.log(error);
      }
    );
  }

  imageValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        return { 'invalidImage': true };
      }
    }
    return null;
  }
  
  uploadFoto(event: Event) {
    
    const file = (event.target as HTMLInputElement)?.files?.[0];
    const fileType = file?.type;
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (!validImageTypes.includes(fileType as string)) {
      alert('Por favor sube un archivo de tipo imagen (gif, jpeg, or png).');
      return;
    }else{

    this.form.patchValue({
      foto: file
    });
    this.form.get('foto')?.updateValueAndValidity();

  }
}
}
