// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private APIURL = 'api/auth/verify-token'; // replace with your API URL

//   constructor(private http: HttpClient) { }

//   checkToken(): Observable<any> {
//     const token = localStorage.getItem('authToken'); // replace with your token retrieval logic
//     const headers = { 'Authorization': `Bearer ${token}` };
//     return this.http.get(`${this.APIURL}/verify-token`, { headers }) 
//     ;
//   }
// }