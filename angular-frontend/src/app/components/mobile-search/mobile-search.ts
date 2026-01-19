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

  // Sidequests search
  query = '';
  mode: QueryMode = 'keywords';

  // Profile search
  profileQuery = '';
  results: User[] = [];
  loadingProfiles = false;
  searchedOnce = false;

  @Output() searchChange = new EventEmitter<{ query: string; mode: QueryMode }>();

  open(): void {
    this.visible = true;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.visible = false;
    document.body.style.overflow = '';
    // reset transient profile state
    this.profileQuery = '';
    this.results = [];
    this.loadingProfiles = false;
    this.searchedOnce = false;
  }

  // Sidequests submit
  submit(): void {
    this.searchChange.emit({ query: this.query.trim(), mode: this.mode });
    this.close();
  }

  clear(): void {
    this.query = '';
  }

  // Profile search via button
  searchProfiles(): void {
    const q = this.profileQuery.trim();
    this.searchedOnce = true;

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
    this.router.navigate(['/user', userId]).then(() => this.close());
  }
}
