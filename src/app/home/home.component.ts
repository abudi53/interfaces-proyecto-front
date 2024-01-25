import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, DialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  visible: boolean = false;

  libros: any[] = [];
  libro: any = {};
  FILE_URL = 'http://localhost:8000/storage/';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadLibros();
  }

  loadLibros() {
    this.http.get('http://localhost:8000/api/libros').subscribe(
      (data: any) => {
        this.libros = data.books;
      },
      (error) => console.error(error)
    );
    
  }

  showDialog(id : number) {
    this.libro = this.findLibro(id);
    this.visible = true;
  }

  findLibro(id : number) {
    let libro : any = this.libros.find(libro => libro.id == id);
    return libro;
  }

  close() {
    this.visible = false;
    this.cdr.detectChanges();
    
  }

  getColorHeader(genero: string): string{
    switch (genero) {
      case 'Ficcion':
        return '#4300F5';

      case 'Romance':
        return '#000000';
        
      case 'Fantasia':
        return '#000000';
      
      case 'Misterio':
        return '#000000';

      case 'Terror':
        return '#000000';

      default:
        return '#000000';

  }
}

  getColorBg(genero: string): string{
    switch (genero) {
      case 'Ficcion':
        return '#7F2DB5';

      case 'Romance':
        return '#DA67F5';
        
      case 'Fantasia':
        return '#E8C500';
      
      case 'Misterio':
        return '#422B47';

      case 'Terror':
        return '#33292A';

      default:
        return '#ffffff';

  }

  }

  getColorBtn(genero: string): string {
    switch (genero) {
      case 'Ficcion':
        return '#D3F500';

      case 'Romance':
        return '#F50000';
        
        
      case 'Fantasia':
        return '#9EE800';
      
      case 'Misterio':
        return '#B700E0';

      case 'Terror':
        return '#FF001A';

      default:
        return '#000000';

  }

  }
}

