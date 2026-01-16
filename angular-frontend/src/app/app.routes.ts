import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { LoginRegistration } from './pages/login-registration/login-registration';
import { QuestsComponent } from './pages/quests/quests';
import { Reviews } from './reviews/reviews';
import { UsersComponent } from './pages/users/users';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [authGuard] },

  // Public/profile routes (jouw eigen profiel)
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // NIEUW: Deze route linkt de zoekbalk aan de Users-pagina
  // Wanneer je klikt op een user, stuurt de navbar je naar /user/UUID
  { path: 'user/:id', component: UsersComponent, canActivate: [authGuard] },

  // De lijst met alle gebruikers (bestaande route)
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },

  // Auth
  { path: 'login', component: LoginRegistration, canActivate: [guestGuard] },

  // Redirects & Quests
  { path: 'messages', redirectTo: '', pathMatch: 'full' },
  { path: 'quests', component: QuestsComponent, canActivate: [authGuard] },
  { path: 'reviews', component: Reviews, canActivate: [authGuard] },

  // Catch-all
  { path: '**', redirectTo: '' }
];
