import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  libros: any[] = [];
  FILE_URL = 'http://localhost:8000/storage/';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLibros();
  }

  loadLibros() {
    this.http.get('http://localhost:8000/api/libros').subscribe(
      (data: any) => {
        this.libros = data.books;
        console.log(this.libros);
      },
      (error) => console.error(error)
    );
    
  }

}

