import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-nav-menue',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './nav-menue.component.html',
  styleUrl: './nav-menue.component.css'
})
export class NavMenueComponent {
 isLoggedIn = false;
  username: string | undefined;

  constructor(private keycloak: KeycloakService) {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.username = this.keycloak.getUsername(); 
  }

  login() {
    this.keycloak.login();
 
    setTimeout(() => {
      this.isLoggedIn = this.keycloak.isLoggedIn();
      this.username = this.keycloak.getUsername();
    }, 1000);
  }

  logout() {
    this.keycloak.logout();
    this.isLoggedIn = false;
    this.username = undefined;
  }
}

