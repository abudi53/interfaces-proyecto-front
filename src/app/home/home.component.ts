import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { CuboComponent } from '../cubo/cubo.component';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, CuboComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  seleccion: any = new Map();
  mostrar_seleccion : any = [];
  libros: any[] = [];
  libro: any = {};
  visible: boolean = false;
  email: string = '';
  totalValue: number = 0;
  totalPrecio: number = 0;
  FILE_URL = 'http://localhost:8000/storage/'; // ENDPOINT PARA GUARDAR ARCHIVOS
  @ViewChild('modalContainer1') modalContainer1!: ElementRef;
  @ViewChild('modalContainer2') modalContainer2!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private renderer : Renderer2, private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';

  ngOnInit() {
    initFlowbite();
    this.loadLibros();
    this.verify_login();
    this.refresh_token();
  }

  verify_login() {
    try {
      const token = localStorage.getItem('authToken');
      this.http.post(this.API_ME, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe( // Verificar si esta logueado
        (response: any) => {
            this.visible = true;
            this.email = response.email;
          }
        )} catch (error) {
          console.log('No esta logueado');
        }
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
    this.router.navigate(['/home']);
  }

  agregar_cesta() {
    if (this.seleccion.has(this.libro)) {
      let currentValue = this.seleccion.get(this.libro);
      this.seleccion.set(this.libro, currentValue + 1);
    }else {
    this.seleccion.set(this.libro, 1);
  }  
}

  toInt(str: string): number {
    return parseFloat(str);
  }

  handleButtonClick(event: MouseEvent) {
    
    const buttonId = (event.target as any).id;
    this.renderer.removeClass(this.modalContainer1.nativeElement, 'out');
    this.renderer.addClass(this.modalContainer1.nativeElement, buttonId);
    this.renderer.addClass(document.body, 'modal-active');
    event.stopPropagation(); // Prevent the click event from bubbling up to the modal container
  }

  handleButtonClick2(event: MouseEvent) {
    
    const buttonId = (event.target as any).id;
    this.renderer.removeClass(this.modalContainer2.nativeElement, 'out');
    this.renderer.addClass(this.modalContainer2.nativeElement, buttonId);
    this.renderer.addClass(document.body, 'modal-active');
    event.stopPropagation(); // Prevent the click event from bubbling up to the modal container

    this.mostrar_seleccion = Array.from(this.seleccion, ([key, value]) => ({...key, value}));
    this.totalValue = this.mostrar_seleccion.reduce((acc: any, item: any) => acc + item.value, 0);
    this.totalPrecio = this.mostrar_seleccion.reduce((acc: any, item: any) => acc + (item.precio * item.value), 0);

  }

  hideDropdown() {
    this.renderer.addClass(this.dropdown.nativeElement, 'hidden');
  }

  handleModalClick() {
    this.renderer.addClass(this.modalContainer1.nativeElement, 'out');
    this.renderer.removeClass(document.body, 'modal-active');
  }
  handleModalClick2() {
    this.renderer.addClass(this.modalContainer2.nativeElement, 'out');
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

