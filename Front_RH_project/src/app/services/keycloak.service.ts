import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloakInstance!: KeycloakInstance;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  initKeycloak(): Promise<boolean> {
    if (!this.isBrowser) return Promise.resolve(false);

    this.keycloakInstance = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });

    return this.keycloakInstance.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    });
  }

  isLoggedIn(): boolean {
    return this.isBrowser && !!this.keycloakInstance?.token;
  }

  login(): void {
    if (this.keycloakInstance) this.keycloakInstance.login();
  }

  logout(): void {
    if (this.keycloakInstance) this.keycloakInstance.logout();
  }

  getToken(): string | undefined {
    return this.keycloakInstance?.token;
  }

  getUsername(): string | undefined {
    return this.keycloakInstance?.tokenParsed?.['preferred_username'];
  }
}


export function initializeKeycloakFactory(keycloak: KeycloakService) {
  return () => keycloak.initKeycloak();
}
