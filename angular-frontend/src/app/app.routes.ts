import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';
import { MessagesComponent } from './pages/message/message'; 
import { QuestsComponent } from './pages/quests/quests';
import { Reviews } from './reviews/reviews'; 
import { UsersComponent } from './pages/users/users'; // 👈 1. NIEUW: Importeer de UsersComponent
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [authGuard] },
  
  // 👈 2. NIEUW: Route voor profielen van ANDEREN (met een ID)
  // Let op: Zet deze BOVEN de gewone 'profile' route voor de zekerheid
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },

  // Route voor je EIGEN profiel (zonder ID)
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // 👈 3. NIEUW: Route naar de lijst met alle gebruikers
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },

  { path: 'login', component: LoginRegistration, canActivate: [guestGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: 'quests', component: QuestsComponent, canActivate: [authGuard] },
  { path: 'reviews', component: Reviews, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '' }
];