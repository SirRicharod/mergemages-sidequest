import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';
import { MessagesComponent } from './pages/message/message'; 
import { QuestsComponent } from './pages/quests/quests';
import { Reviews } from './reviews/reviews'; 
import { UsersComponent } from './pages/users/users'; // 👈 1. NIEUW: Importeer de UsersComponent

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  
  // 👈 2. NIEUW: Route voor profielen van ANDEREN (met een ID)
  // Let op: Zet deze BOVEN de gewone 'profile' route voor de zekerheid
  { path: 'profile/:id', component: ProfileComponent },

  // Route voor je EIGEN profiel (zonder ID)
  { path: 'profile', component: ProfileComponent },

  // 👈 3. NIEUW: Route naar de lijst met alle gebruikers
  { path: 'users', component: UsersComponent },

  { path: 'login', component: LoginRegistration },
  { path: 'messages', component: MessagesComponent },
  { path: 'quests', component: QuestsComponent },
  { path: 'reviews', component: Reviews },
  
  { path: '**', redirectTo: '' }
];