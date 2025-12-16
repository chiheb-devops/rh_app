import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from './services/keycloak.service';
import { NavMenueComponent } from './pages/nav-menue/nav-menue.component';
import { FooterComponent } from './pages/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule,NavMenueComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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

