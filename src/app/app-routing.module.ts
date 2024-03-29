import { NgModule } from '@angular/core';
import {Routes, RouterModule, ExtraOptions} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {BookingComponent} from './components/booking/booking.component';
import {InstallationsComponent} from './components/installations/installations.component';
import {FacilitiesComponent} from './components/facilities/facilities.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'installations', component: InstallationsComponent },
  { path: 'facilities', component: FacilitiesComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

const routerOptions: ExtraOptions = {
  useHash: true,
  anchorScrolling: 'enabled',
};

// then just import your RouterModule with these options


@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
