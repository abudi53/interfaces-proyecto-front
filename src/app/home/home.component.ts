import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { CuboComponent } from '../cubo/cubo.component';
import { Router } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { initFlowbite } from 'flowbite';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare var paypal: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, CuboComponent, GoogleMapsModule],
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
  paidFor: boolean = false;
  cesta_vacia: boolean = true;
  totalValue: number = 0;
  totalPrecio: number = 0;
  data_profile: any = {};
  readonly FILE_URL = 'http://localhost:8000/storage/'; // ENDPOINT PARA GUARDAR ARCHIVOS
  readonly API_ME: string = '/api/auth/me';
  readonly API_VERIFY: string = '/api/auth/verify-token';
  readonly API_REFRESH: string = '/api/auth/refresh';
  readonly API_PROFILE: string = '/api/profile';

  title= 'gmaps';
  position ={
    lat: 10.236692113580581, 
    lng:-67.9624421621695
  };
  label={

    color: 'red',
    text: 'marcador'
  };

  @ViewChild('modalContainer1') modalContainer1!: ElementRef;
  @ViewChild('modalContainer2') modalContainer2!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private renderer : Renderer2, private router: Router, handler: HttpBackend) {
    this.http = new HttpClient(handler);

  }

  ngOnInit() {
    initFlowbite();
    this.loadLibros();
    this.loadPerfil();
    this.verify_login();
    this.refresh_token();
            // FUNCION PAYPAL
    paypal
    .Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              description: 'Compra de libros',
              amount: {
                currency_code: 'USD',
                value: (this.totalPrecio + (this.totalPrecio * 0.16)).toFixed(2)
              }
            }
          ]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        this.paidFor = true;
        this.generatePDF();
        console.log(order);
      },
      onError: (err: any) => {
        console.log(err);
      }
    }).render(this.paypalElement.nativeElement);
  }

  loadPerfil() {
    const token = localStorage.getItem('authToken');

    this.http.post(this.API_ME, {}, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      (response: any) => {
        this.email = response.email; 
               
        this.http.get(this.API_PROFILE + '/' + response.profile_id, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
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

  // ACABA PAYPAL


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

  generatePDF(action = 'open') {
    const docDefinition = {
      content: [
        {
          text: 'LIBRERIA INC.',
          fontSize: 16,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: 'FACTURA',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue',
        },
        {
          text: 'Detalles del cliente',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: this.data_profile.nombre + ' ' + this.data_profile.apellido,
                bold: true,
              },
              { text: this.data_profile.direccion },
              { text: this.email },
              { text: this.data_profile.telefono },
            ],
            [
              {
                text: `Fecha: ${new Date().toLocaleString()}`,
                alignment: 'right',
              },
              {
                text: `Factura N : ${(Math.random() * 1000).toFixed(0)}`,
                alignment: 'right',
              },
            ],
          ],
        },
        {
          text: 'Detalles de la Orden',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Producto', 'Precio', 'Cantidad', 'Total'],
              ...this.mostrar_seleccion.map((p: { titulo: string; precio: number; value: number; }) => [
                p.titulo,
                p.precio,
                p.value,
                (p.precio * p.value).toFixed(2),
              ]),
              [
                { text: 'Precio Total', colSpan: 3 },
                {},
                {},
                (this.totalPrecio + (this.totalPrecio * 0.16)).toFixed(2) + " $",
              ],
            ],
          },
        },
        {
          columns: [
            [{ qr: `${this.data_profile.nombre}`, fit: '50' }],
            [{ text: 'Firma', alignment: 'right', italics: true }],
          ],
        },
        {
          text: 'Terminos y Condiciones',
          style: 'sectionHeader',
        },
        {
          ul: [
            'El cliente dispone de 10 dias para realizar cualquier devolucion.',
            'La garantia del producto estara sujeta a los terminos y condiciones del manufacturador.',
            'Esta es una factura generada automaticamente por el sistema.',
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      const formData: any = new FormData();
    pdfMake.createPdf(docDefinition).getBuffer((buffer: BlobPart) => {
    let blob = new Blob([buffer], {type: 'application/pdf'});
    
    // Convert Blob to File
    let file = new File([blob], 'filename.pdf', {type: 'application/pdf', lastModified: Date.now()});
    
    // Check file size
    if (file.size <= 2048 * 1024) { // 2048 KB
      formData.append('pdf', file);
      this.http.post('http://localhost:8000/api/factura', formData, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }).subscribe(
        (response: any) => {
          console.log(response);
          this.mostrar_seleccion = [];
          this.seleccion.clear();
          this.totalPrecio = 0;
          this.totalValue = 0;
          
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      console.log('File size exceeds the limit');
    }
  });

      
    }
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

  handleButtonClick(event: MouseEvent) { // ABRIR DETALLES LIBRO
    
    const buttonId = (event.target as any).id;
    this.renderer.removeClass(this.modalContainer1.nativeElement, 'out');
    this.renderer.addClass(this.modalContainer1.nativeElement, buttonId);
    this.renderer.addClass(document.body, 'modal-active');
    event.stopPropagation();
  }

  handleButtonClick2(event: MouseEvent) { // ABRIR CESTA
    
    const buttonId = (event.target as any).id;
    this.renderer.removeClass(this.modalContainer2.nativeElement, 'out');
    this.renderer.addClass(this.modalContainer2.nativeElement, buttonId);
    this.renderer.addClass(document.body, 'modal-active');
    event.stopPropagation();

    if (this.seleccion.size > 0) {
      this.cesta_vacia = false;
      this.mostrar_seleccion = Array.from(this.seleccion, ([key, value]) => ({...key, value}));
      this.totalValue = this.mostrar_seleccion.reduce((acc: any, item: any) => acc + item.value, 0);
      this.totalPrecio = this.mostrar_seleccion.reduce((acc: any, item: any) => acc + (item.precio * item.value), 0);
      console.log(this.mostrar_seleccion);
    }else {
      this.cesta_vacia = true;
    }
      

    
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

