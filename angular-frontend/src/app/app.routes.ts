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

  // Public/profile routes (your own profile)
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // NEW: This route links the search bar to the Users page
  // When you click on a user, the navbar sends you to /user/UUID
  { path: 'user/:id', component: UsersComponent, canActivate: [authGuard] },

  // The list of all users (existing route)
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
