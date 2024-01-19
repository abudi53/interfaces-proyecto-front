import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref , HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Libreria';

  ngOnInit() {
    initFlowbite();
  }
}
