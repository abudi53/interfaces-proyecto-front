import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { 
  PreloadAllModules, 
  provideRouter, 
  withDebugTracing, 
  withPreloading, 
  withRouterConfig 
} 
from '@angular/router';

import { APP_ROUTES } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
  provideRouter(APP_ROUTES, 
    withPreloading(PreloadAllModules),
    withDebugTracing(),
  ),

]
})
  .catch((err) => console.error(err));
