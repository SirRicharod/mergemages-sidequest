import { Component, OnInit, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../services/review'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class Reviews implements OnInit, OnChanges { 
  rating: number = 5;
  comment: string = '';
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  reviews: any[] = [];

  @Input() isOwnProfile: boolean = false; 
  @Input() targetUserId: string | null = null;

  constructor(
    private reviewService: ReviewService, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchReviews();
  }

  // When the targetUserId changes (because you click on another profile), we fetch new reviews
  ngOnChanges(changes: SimpleChanges) {
    // Check if targetUserId has changed OR isOwnProfile has changed
    if (changes['targetUserId'] || changes['isOwnProfile']) {
      this.fetchReviews();
    }
  }

  fetchReviews() {
    let url = '';

    if (this.isOwnProfile) {
        // 1. My own profile: Fetch reviews that are about ME
        url = 'http://127.0.0.1:8000/api/user/reviews';
    } else if (this.targetUserId) {
        // 2. Someone else: Fetch reviews for THIS ID
        url = `http://127.0.0.1:8000/api/reviews/${this.targetUserId}`; 
    } else {
        // 3. NO ID? STOP! 🛑
        // This is where the bug was. Previously it loaded the general feed. 
        // Now we do nothing until the ID is loaded.
        this.reviews = []; // Clear the list to be safe
        return; 
    }

    // Only fetch if we have a valid URL
    if (url) {
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          this.reviews = data; 
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Could not load reviews:', err)
      });
    }
  }

  submitReview() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.targetUserId) {
      this.errorMessage = 'No user selected to review.';
      this.isSubmitting = false;
      return;
    }

    const data = {
      target_user_id: this.targetUserId,
      rating: this.rating,
      comment: this.comment
    };

    this.reviewService.postReview(data).subscribe({
      next: (res) => {
        this.successMessage = 'Review posted! 🎉';
        this.comment = ''; 
        this.isSubmitting = false;
        this.fetchReviews(); // Refresh list
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Something went wrong.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}