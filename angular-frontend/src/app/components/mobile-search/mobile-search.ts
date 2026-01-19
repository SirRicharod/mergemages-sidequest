import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';

export type QueryMode = 'keywords' | 'profile' | 'skills';

@Component({
  selector: 'app-mobile-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-search.html',
  styleUrls: ['./mobile-search.css']
})
export class MobileSearchComponent {
  private router = inject(Router);
  private userService = inject(UserService);

  visible = false;

  // Feed search model
  query = '';
  mode: QueryMode = 'keywords';

  // Profile search model/results
  profileQuery = '';
  results: User[] = [];
  loadingProfiles = false;

  @Output() searchChange = new EventEmitter<{ query: string; mode: QueryMode }>();

  open(): void {
    this.visible = true;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.visible = false;
    document.body.style.overflow = '';
    // Optional: clear transient state when closing
    this.profileQuery = '';
    this.results = [];
    this.loadingProfiles = false;
  }

  // Feed search submit
  submit(): void {
    this.searchChange.emit({ query: this.query.trim(), mode: this.mode });
    this.close();
  }

  clear(): void {
    this.query = '';
  }

  // Profile search handlers
  onProfileInput(): void {
    const q = this.profileQuery.trim();
    if (q.length <= 1) {
      this.results = [];
      return;
    }
    this.loadingProfiles = true;
    this.userService.searchUsers(q).subscribe({
      next: (users) => {
        this.results = users;
        this.loadingProfiles = false;
      },
      error: () => {
        this.results = [];
        this.loadingProfiles = false;
      }
    });
  }

  viewProfile(userId: string): void {
    // Navigate to user’s profile, then close the popup
    this.router.navigate(['/user', userId]).then(() => this.close());
  }
}
