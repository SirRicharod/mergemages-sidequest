import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core'; // <--- Input en OnInit toegevoegd
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../services/review'; 
import { HttpClient } from '@angular/common/http'; // <--- HttpClient toegevoegd voor het ophalen

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class Reviews implements OnInit { // <--- implements OnInit toegevoegd
  rating: number = 5;
  comment: string = '';
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // 1. De lijst waarin we de reviews opslaan
  reviews: any[] = [];

  // 2. De schakelaar: false = alles zien, true = alleen mijn reviews
  @Input() personalMode: boolean = false; 

  constructor(
    private reviewService: ReviewService, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient // <--- HttpClient injecteren
  ) {}

  // 3. Zodra het component laadt, halen we de reviews op
  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews() {
    // We kiezen de juiste URL op basis van de schakelaar
    const url = this.personalMode 
      ? 'http://127.0.0.1:8000/api/user/reviews' 
      : 'http://127.0.0.1:8000/api/reviews';

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.reviews = data; // Stop de data in onze lijst
        this.cdr.detectChanges(); // Update het scherm
      },
      error: (err) => console.error('Kon reviews niet laden:', err)
    });
  }

  submitReview() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const targetUserId = 'a0ce6cd7-da41-4b1f-83ea-4e089b5114e5'; 

    const data = {
      target_user_id: targetUserId,
      rating: this.rating,
      comment: this.comment
    };

    console.log('Versturen...', data);

    this.reviewService.postReview(data).subscribe({
      next: (res) => {
        console.log('Gelukt!', res);
        
        this.successMessage = 'Review geplaatst! 🎉';
        this.comment = ''; 
        this.isSubmitting = false;

        // NIEUW: Ververs de lijst direct zodat je je eigen review ziet
        this.fetchReviews(); 

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Foutje:', err);
        this.errorMessage = 'Er ging iets mis. Ben je wel ingelogd?';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}