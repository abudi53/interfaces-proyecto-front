import { Routes } from '@angular/router';
import { HttpClient, HttpBackend, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AlreadyLoggedInGuard } from './already-logged-in.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { CrearLibroComponent } from './crear-libro/crear-libro.component';
import { HomeComponent } from './home/home.component';
import { EditarRedesComponent } from './editar-redes/editar-redes.component';

export const APP_ROUTES: Routes = [
    { path: 'registrarse', component: RegisterComponent, canActivate: [AlreadyLoggedInGuard] },
    { path: 'iniciar-sesion', component: LoginComponent, canActivate: [AlreadyLoggedInGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
    { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
    { path: 'crear-libro', component: CrearLibroComponent, canActivate: [AuthGuard]},
    { path: 'editar-redes', component: EditarRedesComponent, canActivate: [AuthGuard]},
    { path: 'home', component: HomeComponent},


    { path: '', redirectTo: '/home', pathMatch: 'full' }
];

