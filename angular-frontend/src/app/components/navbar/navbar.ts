import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; // Router added
import { FormsModule } from '@angular/forms'; // Needed for the search bar (ngModel)
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service'; // UserService added

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule], // FormsModule added
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() isAuthenticated = false;
  @Input() username: string | null = null;
  @Input() openMobileSearch: (() => void) | null = null;

  private auth = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Zoek-variabelen
  searchQuery: string = '';
  searchResults: User[] = [];
  showResults: boolean = false;

  // Called on every letter you type
  onSearchChange(): void {
    if (this.searchQuery.length > 1) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: (users) => {
          this.searchResults = users;
          this.showResults = true;
        },
        error: () => {
          this.searchResults = [];
        }
      });
    } else {
      this.searchResults = [];
      this.showResults = false;
    }
  }

  // Navigate to the profile and clear the search bar
  viewProfile(userId: string): void {
    this.showResults = false;
    this.searchQuery = '';
    this.router.navigate(['/user', userId]); // Sends you to /user/UUID
  }

  onLogout(): void {
    this.auth.logout().subscribe({
      next: () => {
        // Successfully logged out
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}