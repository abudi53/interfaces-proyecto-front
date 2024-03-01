import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CuboComponent } from '../cubo/cubo.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, CuboComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  libros: any[] = [];
  libro: any = {};
  FILE_URL = 'http://localhost:8000/storage/'; // ENDPOINT PARA GUARDAR ARCHIVOS
  @ViewChild('modalContainer') modalContainer!: ElementRef;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private renderer : Renderer2) {}

  ngOnInit() {
    this.loadLibros();
  }

  handleButtonClick(event: MouseEvent) {
    console.log(this.modalContainer);
    
    const buttonId = (event.target as any).id;
    this.renderer.removeClass(this.modalContainer.nativeElement, 'out');
    this.renderer.addClass(this.modalContainer.nativeElement, buttonId);
    this.renderer.addClass(document.body, 'modal-active');
    event.stopPropagation(); // Prevent the click event from bubbling up to the modal container
  }

  handleModalClick() {
    this.renderer.addClass(this.modalContainer.nativeElement, 'out');
    this.renderer.removeClass(document.body, 'modal-active');
  }

  loadLibros() {
    this.http.get('http://localhost:8000/api/libros').subscribe(
      (data: any) => {
        this.libros = data.books;
      },
      (error) => console.error(error)
    );
    
  }

  showDialog(id : number) { // MOSTRAR MODAL
    this.libro = this.findLibro(id);
  }

  findLibro(id : number) { //BUSCAR LIBRO AL CLICK EN CARRUSEL
    let libro : any = this.libros.find(libro => libro.id == id);
    return libro;
  }

  getColorHeader(genero: string): string{ //CAMBIO COLOR H1
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

  getColorBg(genero: string): string{ //CAMBIO COLOR BACKGROUND
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

  getColorBtn(genero: string): string { // CAMBIO COLOR BOTON
    switch (genero) {
      case 'Ficcion':
        return '#D3F500';

      case 'Romance':
        return '#F50000';
        
        
      case 'Fantasia':
        return '#7997BA';
      
      case 'Misterio':
        return '#B700E0';

      case 'Terror':
        return '#FF001A';

      default:
        return '#000000';

  }

  }

}

