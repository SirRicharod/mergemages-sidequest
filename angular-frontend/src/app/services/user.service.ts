import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  user_id: string; // Changed from 'id' to 'user_id' for your database
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

  // Existing function (can remain)
  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/users`);
  }

  // NEW: Search users for the navbar (like Facebook)
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search/users?query=${query}`);
  }

  // NEW: Fetch another user's profile via their UUID
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }
}