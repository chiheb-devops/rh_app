import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { KeycloakService, initializeKeycloakFactory } from './services/keycloak.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(),
    provideClientHydration(),
    importProvidersFrom(FormsModule, HttpClientModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloakFactory,
      deps: [KeycloakService],
      multi: true
    }
  ]
};
