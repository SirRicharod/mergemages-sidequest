// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';
import { Message } from './pages/message/message';
import { Quests } from './pages/quests/quests';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'messages', component: Message },
  { path: 'quests', component: Quests },
  { path: 'login', component: LoginRegistration },
  { path: '**', redirectTo: '' }
];
