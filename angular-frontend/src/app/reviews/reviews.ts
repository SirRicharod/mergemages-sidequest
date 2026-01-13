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
export class Reviews implements OnInit, OnChanges { // <--- OnChanges toegevoegd
  rating: number = 5;
  comment: string = '';
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  reviews: any[] = [];

  // 👇 DEZE TWEE INPUTS MISTE JE! 👇
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
    if (changes['targetUserId'] && !changes['targetUserId'].firstChange) {
      this.fetchReviews();
    }
  }

  fetchReviews() {
    let url = '';

    if (this.isOwnProfile) {
        // 1. Mijn eigen profiel: Haal reviews op die over MIJ gaan
        url = 'http://127.0.0.1:8000/api/user/reviews';
    } else if (this.targetUserId) {
        // 2. Iemand anders: We moeten reviews ophalen voor DIT specifieke ID
        // LET OP: We moeten deze route zo nog even maken in de backend!
        // Voor nu gebruiken we even de algemene feed als fallback zodat het niet crasht
        url = `http://127.0.0.1:8000/api/reviews/${this.targetUserId}`; 
    } else {
        // 3. Fallback (algemene feed)
        url = 'http://127.0.0.1:8000/api/reviews';
    }

    // Alleen ophalen als we een URL hebben
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

    // We gebruiken nu het ID dat we van de profielpagina hebben gekregen
    if (!this.targetUserId) {
      this.errorMessage = 'Geen gebruiker geselecteerd om te reviewen.';
      this.isSubmitting = false;
      return;
    }

    const data = {
      target_user_id: this.targetUserId, // <--- DYNAMISCH ID GEBRUIKEN
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