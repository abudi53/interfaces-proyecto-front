import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpBackend, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule , Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-crear-libro',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, FileUploadModule],
  templateUrl: './crear-libro.component.html',
  styleUrl: './crear-libro.component.css'
})
export class CrearLibroComponent implements OnInit{

  form: FormGroup;
  private http: HttpClient;

  constructor(public fb: FormBuilder, private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      editorial: ['', Validators.required],
      genero: ['', Validators.required],
      fecha: ['', Validators.required],
      precio: [0, Validators.required],
      foto: [null, this.imageValidator],
      pdf: [null, this.pdfValidator],
    });
  }
  
  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';
  readonly API_CREAR_LIBRO: string = '/api/libros';

  ngOnInit(): void {
      this.refresh_token();
      // this.verify_admin();
      
  }

  verify_admin() {
    const token = localStorage.getItem('authToken');

    this.http.post(this.API_ME, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar si es admin
      (response: any) => {
        if (response.is_admin) {
          this.refresh_token();
          console.log('Es admin');          
        } else {
          console.log('No es admin');
          this.router.navigate(['/home']);
        }
      });
  }

  refresh_token() {

    let token = localStorage.getItem('authToken');

    this.http.get(this.API_VERIFY, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar token
    (response: any) => { 
      console.log("paso1");
      
      this.http.post(this.API_REFRESH, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Refrescar token
        (response: any) => {
          console.log("paso2");
          
          localStorage.setItem('authToken', response.access_token);
        },
        (error) => {
          console.log("error2");
          
          this.logout();
        }
      );
    },
    (error) => {
      console.log("error1");
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
  
    formData.append('titulo', this.form.get('titulo')?.value);
    formData.append('autor', this.form.get('autor')?.value);
    formData.append('editorial', this.form.get('editorial')?.value);
    formData.append('genero', this.form.get('genero')?.value);
    formData.append('fecha', this.form.get('fecha')?.value);
    formData.append('precio', this.form.get('precio')?.value);
    formData.append('foto', this.form.get('foto')?.value);
    formData.append('pdf', this.form.get('pdf')?.value);
  
    this.http.post(this.API_CREAR_LIBRO, formData).subscribe(
      (response: any) => {
        this.refresh_token();
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

  pdfValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (extension !== 'pdf') {
        return { 'invalidPdf': true };
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

  uploadPdf(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    const fileType = file?.type;

    if (fileType !== 'application/pdf') {
      alert('Por favor sube un archivo de tipo pdf.');
      return;
    }

    this.form.patchValue({
      pdf: file
    });
    this.form.get('pdf')?.updateValueAndValidity();

  }


  
}

