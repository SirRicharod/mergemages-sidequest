import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Belangrijk voor de klikbare linkjes

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  http = inject(HttpClient);
  users: any[] = [];

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any>('http://127.0.0.1:8000/api/users').subscribe({
      next: (response) => {
        // We slaan de lijst met gebruikers op
        this.users = response.users;
      },
      error: (err) => console.error('Oeps, kon gebruikers niet laden:', err)
    });
  }
}