import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { EmployeComponent } from './pages/employe/employe.component';
import { RegionComponent } from './pages/region/region.component';
import { DeptComponent } from './pages/departemnt/departemnt.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'region', component: RegionComponent },
  { path: 'employe', component: EmployeComponent },
  { path: 'dept', component: DeptComponent },

  // Optional: wildcard for unknown routes
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


