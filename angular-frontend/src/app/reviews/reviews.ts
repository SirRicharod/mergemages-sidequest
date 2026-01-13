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

  // Als de targetUserId verandert (omdat je op een ander profiel klikt), halen we nieuwe reviews op
  ngOnChanges(changes: SimpleChanges) {
    // Check of targetUserId is veranderd OF isOwnProfile is veranderd
    if (changes['targetUserId'] || changes['isOwnProfile']) {
      this.fetchReviews();
    }
  }

  fetchReviews() {
    let url = '';

    if (this.isOwnProfile) {
        // 1. Mijn eigen profiel: Haal reviews op die over MIJ gaan
        url = 'http://127.0.0.1:8000/api/user/reviews';
    } else if (this.targetUserId) {
        // 2. Iemand anders: Haal reviews op voor DIT ID
        url = `http://127.0.0.1:8000/api/reviews/${this.targetUserId}`; 
    } else {
        // 3. GEEN ID? STOP! 🛑
        // Hier zat de fout. Vroeger laadde hij de algemene feed. 
        // Nu doen we niks totdat het ID geladen is.
        this.reviews = []; // Maak de lijst leeg voor de zekerheid
        return; 
    }

    // Alleen ophalen als we een geldige URL hebben
    if (url) {
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          this.reviews = data; 
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Kon reviews niet laden:', err)
      });
    }
  }

  submitReview() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.targetUserId) {
      this.errorMessage = 'Geen gebruiker geselecteerd om te reviewen.';
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
        this.successMessage = 'Review geplaatst! 🎉';
        this.comment = ''; 
        this.isSubmitting = false;
        this.fetchReviews(); // Lijst verversen
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Foutje:', err);
        this.errorMessage = 'Er ging iets mis.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}