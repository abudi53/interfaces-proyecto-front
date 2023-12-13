import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AlreadyLoggedInGuard } from './already-logged-in.guard';
import { PerfilComponent } from './perfil/perfil.component';


export const APP_ROUTES: Routes = [
    { path: 'registrarse', component: RegisterComponent, canActivate: [AlreadyLoggedInGuard] },
    { path: 'iniciar-sesion', component: LoginComponent, canActivate: [AlreadyLoggedInGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
    { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' }
];

