import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  constructor() { }

  register(formValue: any) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/register`, formValue)
      );
  }
}
