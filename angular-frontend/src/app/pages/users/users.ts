import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: any[] = []; 
  selectedUser: any = null; 
  reviews: any[] = []; // NEW: Here we store reviews of others
  isSingleProfile: boolean = false;
  loading: boolean = false;

  reviewComment: string = '';
  reviewRating: number = 5;
  submitting: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      
      if (userId) {
        this.isSingleProfile = true; 
        this.selectedUser = null; 
        this.reviews = []; // Clear the list for the new user
        this.loading = true;
        this.cdr.detectChanges(); 
        this.loadUserProfile(userId);
      } else {
        this.isSingleProfile = false;
        this.loading = true;
        this.fetchUsers();
      }
    });
  }

  loadUserProfile(id: string) {
    this.userService.getUserProfile(id).subscribe({
      next: (response: any) => {
        this.selectedUser = response.user || response;
        // Sla de reviews op die we via de 'with' in Laravel hebben meegestuurd
        this.reviews = response.reviews || []; 
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Fout:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchUsers() {
    this.http.get<any>('http://127.0.0.1:8000/api/users').subscribe({
      next: (response) => {
        this.users = response.users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitReview() {
    if (!this.selectedUser || !this.reviewComment.trim()) return;
    this.submitting = true;

    this.http.post('http://127.0.0.1:8000/api/reviews', {
      target_user_id: this.selectedUser.user_id, 
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: () => {
        alert('Review posted!');
        this.reviewComment = '';
        this.submitting = false;
        // Reload the profile so your own review appears directly in the list
        this.loadUserProfile(this.selectedUser.user_id);
      },
      error: () => {
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}