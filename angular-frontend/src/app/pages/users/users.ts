import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef toegevoegd
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
  private cdr = inject(ChangeDetectorRef); // Injecteer de 'ververser'

  users: any[] = []; 
  selectedUser: any = null; 
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
        this.loading = true;
        this.cdr.detectChanges(); // Direct verversen naar loading-scherm
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
        this.loading = false;
        this.cdr.detectChanges(); // FORCEER verversing: Nu springt hij direct naar het profiel!
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
        alert('Review geplaatst!');
        this.reviewComment = '';
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}