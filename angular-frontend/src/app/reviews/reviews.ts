import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// BELANGRIJK: Hier verwijzen we naar jouw bestand 'review.ts'
import { ReviewService } from '../services/review'; 

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class Reviews {
  rating: number = 5;
  comment: string = '';
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private reviewService: ReviewService) {}

  submitReview() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    // --- HIER MOET JE STRAKS DE UUID PLAKKEN ---
    // Dit is nodig omdat je een review altijd AAN iemand geeft.
    const targetUserId = 'PLAK-HIER-STRAKS-DE-UUID'; 

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
        this.comment = ''; // Veld leegmaken
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Foutje:', err);
        this.errorMessage = 'Er ging iets mis. Ben je wel ingelogd?';
        this.isSubmitting = false;
      }
    });
  }
}