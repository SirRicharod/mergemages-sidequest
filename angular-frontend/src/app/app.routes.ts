// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'login', component: LoginRegistration, canActivate: [guestGuard] },
    { path: '**', redirectTo: '' }
];
