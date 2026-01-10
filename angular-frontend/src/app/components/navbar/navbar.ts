import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // Pass this from your root (or wire to AuthService later)
  @Input() isAuthenticated = false;
  @Input() username: string | null = null;

  // Stub logout hook — replace with real service call
  onLogout(): void {
    // TODO: integrate with your auth service (e.g., call /api/logout, clear token)
    alert('Logged out (stub). Replace with your AuthService logout.');
  }
}
