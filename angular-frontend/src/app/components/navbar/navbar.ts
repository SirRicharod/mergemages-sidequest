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
  @Input() isAuthenticated = false;
  @Input() username: string | null = null;

  @Input() openMobileSearch: (() => void) | null = null;

  onLogout(): void {
    alert('Logged out (stub). Replace with your AuthService logout.');
  }
}
