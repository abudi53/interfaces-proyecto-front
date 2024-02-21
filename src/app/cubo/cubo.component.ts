import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Component({
  selector: 'app-cubo',
  standalone: true,
  imports: [],
  templateUrl: './cubo.component.html',
  styleUrl: './cubo.component.css'
})
export class CuboComponent implements OnInit{
  private http: HttpClient;
  redes: any[] = [];

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }
    ngOnInit() {
    this.loadData();
  }

  readonly API_REDES: string = '/api/redes';
  readonly FILE_URL = 'http://localhost:8000/storage/'; // ENDPOINT PARA GUARDAR ARCHIVOS


  loadData(){
    this.http.get(this.API_REDES).subscribe(
      (response: any) => {
        this.redes = response.socials;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
