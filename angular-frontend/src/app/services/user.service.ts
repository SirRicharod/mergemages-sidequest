import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  user_id: string; // Veranderd van 'id' naar 'user_id' voor jouw database
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  xp_balance?: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  // Bestaande functie (mag blijven staan)
  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/users`);
  }

  // NIEUW: Zoek gebruikers voor de navbar (zoals Facebook)
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search/users?query=${query}`);
  }

  // NIEUW: Haal profiel van een ander op via hun UUID
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }
}