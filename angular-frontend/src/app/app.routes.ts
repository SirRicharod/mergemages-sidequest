// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'profile', component: Profile },
    { path: 'login', component: LoginRegistration },
    { path: '**', redirectTo: '' }
];
