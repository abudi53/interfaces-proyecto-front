import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';

export const APP_ROUTES: Routes = [
    { path: 'registrarse', component: RegisterComponent },
    { path: 'iniciar-sesion', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' }
];

