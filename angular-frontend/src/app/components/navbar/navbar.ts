import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; // Router toegevoegd
import { FormsModule } from '@angular/forms'; // Nodig voor de zoekbalk (ngModel)
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service'; // UserService toegevoegd

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule], // FormsModule toegevoegd
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

  // Wordt aangeroepen bij elke letter die je typt
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

  // Navigeer naar het profiel en maak de zoekbalk leeg
  viewProfile(userId: string): void {
    this.showResults = false;
    this.searchQuery = '';
    this.router.navigate(['/user', userId]); // Stuurt je naar /user/UUID
  }

  onLogout(): void {
    this.auth.logout(); // Zonder .subscribe() omdat het void is
  }
}