import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const APP_ROUTES: Routes = [
    { path: 'registrarse', component: RegisterComponent },
    { path: 'iniciar-sesion', component: LoginComponent },
    { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' }
];
