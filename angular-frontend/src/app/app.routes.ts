// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';
import { MessagesComponent } from './pages/message/message'; // adjust to your folder/file
import { QuestsComponent } from './pages/quests/quests';
import { Reviews } from './reviews/reviews';       // adjust to your folder/file

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginRegistration },
  { path: 'messages', component: MessagesComponent },
  { path: 'quests', component: QuestsComponent },
  { path: 'reviews', component: Reviews }, // New route for reviews
  { path: '**', redirectTo: '' }
];
